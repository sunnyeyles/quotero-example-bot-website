"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const morphTime = 1.5;
const cooldownTime = 0.5;
const initialDisplayTime = 2.0; // 2 seconds for first text to display

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(initialDisplayTime); // Start with 2 second delay
  const timeRef = useRef(new Date());
  const hasStartedRef = useRef(false);

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const spacerRef = useRef<HTMLSpanElement>(null);

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2, spacer] = [
        text1Ref.current,
        text2Ref.current,
        spacerRef.current,
      ];
      if (!current1 || !current2) return;

      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(
        8 / invertedFraction - 8,
        100
      )}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      const currentText = texts[textIndexRef.current % texts.length];
      const nextText = texts[(textIndexRef.current + 1) % texts.length];

      current1.textContent = currentText;
      current2.textContent = nextText;

      // Update spacer with the currently more visible text for proper height
      if (spacer) {
        spacer.textContent = fraction > 0.5 ? nextText : currentText;
      }
    },
    [texts]
  );

  const doMorph = useCallback(() => {
    // Mark that morphing has started after initial delay
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
    }

    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2, spacer] = [
      text1Ref.current,
      text2Ref.current,
      spacerRef.current,
    ];
    if (current1 && current2) {
      // On initial display, show first text and keep it visible for 2 seconds
      if (!hasStartedRef.current) {
        const firstText = texts[0];
        current1.textContent = firstText;
        current2.textContent = texts[1 % texts.length] || firstText;
        current1.style.filter = "none";
        current1.style.opacity = "100%";
        current2.style.filter = "none";
        current2.style.opacity = "0%";
        if (spacer) {
          spacer.textContent = firstText;
        }
      } else {
        // Normal cooldown: show text2, hide text1
        current2.style.filter = "none";
        current2.style.opacity = "100%";
        current1.style.filter = "none";
        current1.style.opacity = "0%";
        // Update spacer to match the visible text
        if (spacer && current2.textContent) {
          spacer.textContent = current2.textContent;
        }
      }
    }
  }, [texts]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000;
      timeRef.current = newTime;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) doMorph();
      else doCooldown();
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref, spacerRef };
};

interface MorphingTextProps {
  className?: string;
  texts: string[];
}

const Texts: React.FC<Pick<MorphingTextProps, "texts">> = ({ texts }) => {
  const { text1Ref, text2Ref, spacerRef } = useMorphingText(texts);

  // Initialize spacer with first text
  useEffect(() => {
    if (spacerRef.current && texts.length > 0) {
      spacerRef.current.textContent = texts[0];
    }
  }, [texts, spacerRef]);

  return (
    <>
      <span
        ref={spacerRef}
        className="invisible inline-block text-center"
        aria-hidden="true"
      />
      <span
        className="absolute left-0 right-0 top-0 m-auto inline-block text-center"
        ref={text1Ref}
      />
      <span
        className="absolute left-0 right-0 top-0 m-auto inline-block text-center"
        ref={text2Ref}
      />
    </>
  );
};

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
}) => (
  <div
    className={cn(
      "relative mx-auto w-full max-w-3xl text-center font-sans leading-tight font-bold filter-[url(#threshold)_blur(0.6px)]",
      className
    )}
  >
    <Texts texts={texts} />
    <SvgFilters />
  </div>
);
