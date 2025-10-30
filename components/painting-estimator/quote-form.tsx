"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  QuoteFormData,
  PaintingDetails,
  RoomDimensions,
  PaintQuality,
  ContactDetails,
  RoomDetail,
} from "./types";
import { StepOne } from "./step-one";
import { StepTwo } from "./step-two";
import { StepThree } from "./step-three";
import { ContactDetailsStep } from "./step-contact";
import { ImageUpload } from "./image-upload";
import Stepper, { Step } from "@/components/ui/form-stepper";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/shadcn-studio/input/input-40";
import { Textarea } from "@/components/ui/textarea";

type StepDef = {
  key: string;
  name: string;
  enabled: boolean;
  render: React.ReactNode;
};

export function QuoteForm() {
  const router = useRouter();
  const [showQuote] = useState(false);
  const [enabledSections, setEnabledSections] = useState({
    contactDetails: true,
    projectScope: true,
    roomDimensions: true,
    paintQuality: true,
    additionalDetails: true,
    perRoom: false,
  });
  const [formData, setFormData] = useState<QuoteFormData>({
    contactDetails: {
      clientName: "",
      email: "",
      phone: "",
      address: "",
      suburb: "",
      state: "",
      postcode: "",
    },
    paintingDetails: {
      scope: "interior",
      roomType: "",
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      paintQuality: {
        quality: "good",
        pricePerLitre: 35,
      },
      numberOfCoats: 2,
    },
    images: [],
    additionalDetails: {
      includeCeilings: true,
      doorsCount: 0,
      windowsCount: 0,
      trimsLinearMetres: 0,
      schedulePreference: "",
      notes: "",
    },
    rooms: [],
    roomsCount: 0,
  });

  const updatePaintingDetails = (data: Partial<PaintingDetails>) => {
    setFormData((prev) => ({
      ...prev,
      paintingDetails: { ...prev.paintingDetails, ...data },
    }));
  };

  const updateDimensions = (data: RoomDimensions) => {
    setFormData((prev) => ({
      ...prev,
      paintingDetails: {
        ...prev.paintingDetails,
        dimensions: data,
      },
    }));
  };

  const updatePaintQuality = (data: PaintQuality) => {
    setFormData((prev) => ({
      ...prev,
      paintingDetails: {
        ...prev.paintingDetails,
        paintQuality: data,
      },
    }));
  };

  const updateContactDetails = (data: Partial<ContactDetails>) => {
    setFormData((prev) => ({
      ...prev,
      contactDetails: { ...prev.contactDetails, ...data },
    }));
  };

  const updateImages = (images: File[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  };

  const updateAdditionalDetails = (
    data: Partial<QuoteFormData["additionalDetails"]>
  ) => {
    setFormData((prev) => {
      const current = prev.additionalDetails ?? {
        includeCeilings: true,
        doorsCount: 0,
        windowsCount: 0,
        trimsLinearMetres: 0,
        schedulePreference: "",
        notes: "",
      };
      const merged = {
        ...current,
        ...data,
      } as QuoteFormData["additionalDetails"];
      return {
        ...prev,
        additionalDetails: merged,
      };
    });
  };

  const setRoomsCount = (count: number) => {
    setFormData((prev) => {
      const newCount = Math.min(10, Math.max(0, Math.floor(count)));
      const rooms: RoomDetail[] = Array.from({ length: newCount }, (_, i) => {
        const existing = prev.rooms?.[i];
        return (
          existing || {
            roomIndex: i + 1,
            roomType: "",
            wallsAreaSqm: 0,
            ceilingAreaSqm: 0,
            includeWalls: true,
            includeCeilings: !!prev.additionalDetails?.includeCeilings,
          }
        );
      });
      return { ...prev, roomsCount: newCount, rooms };
    });
  };

  const updateRoomDetail = (index: number, data: Partial<RoomDetail>) => {
    setFormData((prev) => {
      const rooms = (prev.rooms || []).slice();
      if (!rooms[index]) {
        rooms[index] = {
          roomIndex: index + 1,
          roomType: "",
          wallsAreaSqm: 0,
          ceilingAreaSqm: 0,
          includeWalls: true,
          includeCeilings: !!prev.additionalDetails?.includeCeilings,
        };
      }
      rooms[index] = { ...rooms[index], ...data } as RoomDetail;
      return { ...prev, rooms };
    });
  };

  // Navigate to results page instead of showing inline
  if (showQuote) {
    // Store form data in sessionStorage and navigate
    if (typeof window !== "undefined") {
      sessionStorage.setItem("estimateFormData", JSON.stringify(formData));
      router.push("/bots/painting-estimator/result");
    }
    return null;
  }

  const updateStepNote = (key: string, note: string) => {
    setFormData((prev) => ({
      ...prev,
      stepNotes: { ...(prev.stepNotes || {}), [key]: note },
    }));
  };

  const perRoomSteps: StepDef[] =
    enabledSections.perRoom && formData.roomsCount
      ? Array.from({ length: formData.roomsCount }, (_, i) => ({
          key: `room-${i + 1}`,
          name: `Room ${i + 1}`,
          enabled: true,
          render: (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Room {i + 1} Details
                </h2>
                <p className="text-muted-foreground">
                  Type, areas and inclusions
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm">Room type</label>
                  <Input
                    placeholder="e.g., Bedroom, Living, Kitchen"
                    value={formData.rooms?.[i]?.roomType || ""}
                    onChange={(e) =>
                      updateRoomDetail(i, { roomType: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Walls area (m²)</label>
                  <NumberInput
                    minValue={0}
                    value={formData.rooms?.[i]?.wallsAreaSqm || 0}
                    onChange={(v) =>
                      updateRoomDetail(i, { wallsAreaSqm: v ?? 0 })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm">Ceiling area (m²)</label>
                  <NumberInput
                    minValue={0}
                    value={formData.rooms?.[i]?.ceilingAreaSqm || 0}
                    onChange={(v) =>
                      updateRoomDetail(i, { ceilingAreaSqm: v ?? 0 })
                    }
                  />
                </div>
              </div>
              <ImageUpload
                images={formData.images}
                onImagesChange={updateImages}
              />
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm">Notes for this room</label>
                <Textarea
                  placeholder={`Add any extra context for Room ${i + 1}`}
                  value={formData.stepNotes?.[`room-${i + 1}`] || ""}
                  onChange={(e) =>
                    updateStepNote(`room-${i + 1}`, e.target.value)
                  }
                />
              </div>
            </div>
          ),
        }))
      : [];

  const stepDefs: StepDef[] = [
    {
      key: "contactDetails",
      name: "Contact Details",
      enabled: enabledSections.contactDetails,
      render: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Contact Details</h2>
            <p className="text-muted-foreground">
              Let&apos;s start with your contact information
            </p>
          </div>
          <ContactDetailsStep
            data={formData.contactDetails}
            onDataChange={updateContactDetails}
          />
          <ImageUpload images={formData.images} onImagesChange={updateImages} />
          <div className="space-y-2">
            <label className="text-sm">Notes for this step</label>
            <Textarea
              placeholder="Add any extra context for contact & photos"
              value={formData.stepNotes?.contact || ""}
              onChange={(e) => updateStepNote("contact", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      key: "projectScope",
      name: "Project Scope",
      enabled: enabledSections.projectScope,
      render: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Project Scope</h2>
            <p className="text-muted-foreground">
              Tell us about your painting project
            </p>
          </div>
          <StepOne
            data={formData.paintingDetails}
            onDataChange={updatePaintingDetails}
          />
          <div className="max-w-sm">
            <label className="text-sm">Number of rooms</label>
            <NumberInput
              minValue={0}
              maxValue={10}
              step={1}
              value={formData.roomsCount ?? 0}
              onChange={(v) => setRoomsCount(v ?? 0)}
            />
          </div>
          <ImageUpload images={formData.images} onImagesChange={updateImages} />
          <div className="space-y-2">
            <label className="text-sm">Notes for this step</label>
            <Textarea
              placeholder="Add any extra context for scope"
              value={formData.stepNotes?.scope || ""}
              onChange={(e) => updateStepNote("scope", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      key: "roomDimensions",
      name: "Room Dimensions",
      enabled: enabledSections.roomDimensions,
      render: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Room Dimensions</h2>
            <p className="text-muted-foreground">
              Provide the measurements for accurate pricing
            </p>
          </div>
          <StepTwo
            data={formData.paintingDetails.dimensions}
            onDataChange={updateDimensions}
          />
          <ImageUpload images={formData.images} onImagesChange={updateImages} />
          <div className="space-y-2">
            <label className="text-sm">Notes for this step</label>
            <Textarea
              placeholder="Add any extra context for dimensions"
              value={formData.stepNotes?.dimensions || ""}
              onChange={(e) => updateStepNote("dimensions", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      key: "paintQuality",
      name: "Paint Quality",
      enabled: enabledSections.paintQuality,
      render: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Paint Quality & Coats</h2>
            <p className="text-muted-foreground">
              Choose your paint quality and number of coats
            </p>
          </div>
          <StepThree
            paintQuality={formData.paintingDetails.paintQuality}
            numberOfCoats={formData.paintingDetails.numberOfCoats}
            onPaintQualityChange={updatePaintQuality}
            onNumberOfCoatsChange={(coats) =>
              updatePaintingDetails({ numberOfCoats: coats })
            }
          />
          <ImageUpload images={formData.images} onImagesChange={updateImages} />
          <div className="space-y-2">
            <label className="text-sm">Notes for this step</label>
            <Textarea
              placeholder="Add any extra context for paint & coats"
              value={formData.stepNotes?.paint || ""}
              onChange={(e) => updateStepNote("paint", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      key: "additionalDetails",
      name: "Summary",
      enabled: enabledSections.additionalDetails,
      render: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Summary</h2>
            <p className="text-muted-foreground">
              Review a summary of your inputs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Contact</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Name: {formData.contactDetails.clientName || "-"}</p>
                <p>Email: {formData.contactDetails.email || "-"}</p>
                <p>Phone: {formData.contactDetails.phone || "-"}</p>
                <p>
                  Address:{" "}
                  {[
                    formData.contactDetails.address,
                    formData.contactDetails.suburb,
                    formData.contactDetails.state,
                    formData.contactDetails.postcode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Project Scope</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Scope: {formData.paintingDetails.scope}</p>
                <p>Room type: {formData.paintingDetails.roomType || "-"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Room Dimensions</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Length: {formData.paintingDetails.dimensions.length} m</p>
                <p>Width: {formData.paintingDetails.dimensions.width} m</p>
                <p>Height: {formData.paintingDetails.dimensions.height} m</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Paint</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Quality: {formData.paintingDetails.paintQuality.quality}</p>
                <p>
                  Price/L: $
                  {formData.paintingDetails.paintQuality.pricePerLitre}
                </p>
                <p>Coats: {formData.paintingDetails.numberOfCoats}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Additional Options</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Include ceilings:{" "}
                  {formData.additionalDetails?.includeCeilings ? "Yes" : "No"}
                </p>
                <p>Doors: {formData.additionalDetails?.doorsCount ?? 0}</p>
                <p>Windows: {formData.additionalDetails?.windowsCount ?? 0}</p>
                <p>
                  Trims (m):{" "}
                  {formData.additionalDetails?.trimsLinearMetres ?? 0}
                </p>
                <p>
                  Schedule:{" "}
                  {formData.additionalDetails?.schedulePreference || "-"}
                </p>
                {formData.additionalDetails?.notes ? (
                  <p>Notes: {formData.additionalDetails?.notes}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Rooms</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Total rooms: {formData.roomsCount}</p>
                {(formData.rooms || []).length > 0 ? (
                  <div className="space-y-1">
                    {(formData.rooms || []).map((r, i) => (
                      <div key={i} className="border rounded-md p-2">
                        <p className="font-medium">Room {r.roomIndex}</p>
                        <p>Type: {r.roomType || "-"}</p>
                        <p>Walls area: {r.wallsAreaSqm} m²</p>
                        <p>Ceiling area: {r.ceilingAreaSqm} m²</p>
                        <p>Include walls: {r.includeWalls ? "Yes" : "No"}</p>
                        <p>
                          Include ceilings: {r.includeCeilings ? "Yes" : "No"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Photos</h3>
              {formData.images.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded-md overflow-hidden border"
                    >
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Uploaded: 0</div>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            You can go back to previous steps to make changes before submitting.
          </div>
        </div>
      ),
    },

    ...perRoomSteps,
  ];

  const activeSteps = stepDefs.filter((s) => s.enabled);

  return (
    <Stepper
      initialStep={1}
      onStepChange={() => {}}
      onFinalStepCompleted={() => {
        // Store form data and navigate
        if (typeof window !== "undefined") {
          sessionStorage.setItem("estimateFormData", JSON.stringify(formData));
          router.push("/bots/painting-estimator/result");
        }
      }}
      stepNames={["Customize Questions", ...activeSteps.map((s) => s.name)]}
    >
      <Step>
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2">Customize Questions</h2>
            <p className="text-muted-foreground">
              Select which sections to include in the estimator
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 border rounded-md">
              <Checkbox
                checked={enabledSections.contactDetails}
                onCheckedChange={(v) =>
                  setEnabledSections((p) => ({
                    ...p,
                    contactDetails: Boolean(v),
                  }))
                }
              />
              <span>Contact Details</span>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-md">
              <Checkbox
                checked={!!formData.additionalDetails?.includeCeilings}
                onCheckedChange={(v) =>
                  updateAdditionalDetails({ includeCeilings: Boolean(v) })
                }
              />
              <span>Include Ceilings</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-md">
              <Checkbox
                checked={enabledSections.perRoom}
                onCheckedChange={(v) =>
                  setEnabledSections((p) => ({ ...p, perRoom: Boolean(v) }))
                }
              />
              <span>Per-room details</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-md">
              <Checkbox
                checked={enabledSections.projectScope}
                onCheckedChange={(v) =>
                  setEnabledSections((p) => ({
                    ...p,
                    projectScope: Boolean(v),
                  }))
                }
              />
              <span>Project Scope</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-md">
              <Checkbox
                checked={enabledSections.roomDimensions}
                onCheckedChange={(v) =>
                  setEnabledSections((p) => ({
                    ...p,
                    roomDimensions: Boolean(v),
                  }))
                }
              />
              <span>Room Dimensions</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-md">
              <Checkbox
                checked={enabledSections.paintQuality}
                onCheckedChange={(v) =>
                  setEnabledSections((p) => ({
                    ...p,
                    paintQuality: Boolean(v),
                  }))
                }
              />
              <span>Paint Quality & Coats</span>
            </label>
          </div>
        </div>
      </Step>

      {activeSteps.map((s, idx) => (
        <Step key={s.key + idx}>{s.render}</Step>
      ))}
    </Stepper>
  );
}
