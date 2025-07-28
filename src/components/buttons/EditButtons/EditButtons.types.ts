export type EditButtonsColors = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'background' | 'background-light' | 'background-dark';

export interface EditButtonsProps {
   editMode?: boolean;
   title?: string;
   className?: string;
   setEditMode?: (editMode: boolean) => void;
   editColor?: EditButtonsColors;
   cancelColor?: EditButtonsColors;
   [key: string]: any; // Allow additional props for flexibility
}
