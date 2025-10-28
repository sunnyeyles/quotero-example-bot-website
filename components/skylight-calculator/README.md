# Skylight Calculator

A comprehensive multi-step quote form for skylight installation services built with Next.js, Tailwind CSS, and shadcn/ui.

## Features

- **8-Step Form Process**: Guided form with progress tracking
- **Smart Validation**: Real-time validation for each step
- **Dynamic Pricing**: Automatic quote calculation based on selections
- **Image Upload**: Support for multiple property images
- **Responsive Design**: Mobile-friendly interface
- **Professional Quote**: Detailed breakdown with GST calculation

## Components

### Main Components

- `QuoteForm`: Main form container with step navigation
- `QuoteResult`: Quote display with pricing breakdown
- `ImageUpload`: File upload with preview functionality
- `StepNotes`: Optional notes section for each step

### Step Components

- `StepOne`: Personal details (name, email, phone)
- `StepTwo`: Location selection with suburb dropdown
- `StepThree`: Installation type (roof-only vs complete)
- `StepFour`: Roof type (tile, metal, other)
- `StepFive`: Roof pitch (flat, pitched, steep)
- `StepSix`: Skylight type and size selection
- `StepSeven`: Additional skylights (optional)
- `StepEight`: Property details (storeys, inspection availability)

## Pricing Logic

### Base Installation

- Roof-only installation: $800
- Complete installation: $2,000

### Adjustments

- **Roof Type**: Metal (+$300), Tile (+$500)
- **Roof Pitch**: Flat (+$200), Pitched (+$400)
- **Skylight Types**: Fixed ($800), Electric ($1,500), Manual ($1,200), Solar ($1,800)
- **Storeys**: Double storey (+$800)
- **Premium Suburbs**: +$50 (Bondi, Coogee, Paddington, etc.)

### Additional Features

- Multiple skylights support
- GST calculation (10%)
- Premium suburb detection
- Conditional logic (Manual/Solar only for pitched roofs)

## Usage

```tsx
import { QuoteForm } from "@/components/skylight-calculator";

export default function MyPage() {
  return <QuoteForm />;
}
```

## Form Validation

Each step includes comprehensive validation:

- Required field validation
- Email format validation
- Phone number validation
- Conditional field requirements
- Step-by-step navigation control

## Styling

Uses default shadcn/ui theme colors with:

- Card-based layout
- Professional typography
- Smooth transitions
- Hover states
- Responsive grid layouts

## Dependencies

- @radix-ui/react-\* components
- lucide-react for icons
- class-variance-authority, clsx, tailwind-merge
- sonner for toast notifications

## File Structure

```
components/skylight-calculator/
├── index.ts                 # Main exports
├── types.ts                 # TypeScript definitions
├── quote-form.tsx          # Main form component
├── quote-result.tsx        # Quote display component
├── image-upload.tsx        # Image upload component
├── step-notes.tsx          # Notes component
├── step-one.tsx            # Personal details step
├── step-two.tsx            # Location step
├── step-three.tsx          # Installation type step
├── step-four.tsx           # Roof type step
├── step-five.tsx           # Roof pitch step
├── step-six.tsx            # Skylight type/size step
├── step-seven.tsx          # Additional skylights step
└── step-eight.tsx          # Property details step
```

## Demo

Visit `/skylight-calculator` to see the form in action.
