export interface FavoriteButtonProps {
   className?: string | string[];
   iconSize?: 'small' | 'medium' | 'large';
   spinnerSize?: string;
   onClick: () => void | Promise<void>;
   isFavorite: boolean;
}
