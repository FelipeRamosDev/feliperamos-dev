import { Close, Edit } from '@mui/icons-material';
import RoundButton from '../RoundButton/RoundButton';
import { EditButtonsProps } from './EditButtons.types';
import texts from './EditButtons.text';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

export default function EditButtons({
   title,
   className,
   editMode = false,
   setEditMode = () => {},
   editColor = 'background',
   cancelColor = 'error',
   ...props
}: EditButtonsProps): React.ReactElement {
   const { textResources } = useTextResources(texts);
   const editTitle = title || textResources.getText('EditButtons.title.edit');
   const cancelTitle = title || textResources.getText('EditButtons.title.cancel');

   if (!editMode) {
      return (
         <RoundButton
            title={editTitle}
            aria-label={editTitle}
            className={className}
            onClick={() => setEditMode(true)}
            color={editColor}
            {...props}
         >
            <Edit />
         </RoundButton>
      );
   } else {
      return (
         <RoundButton
            title={cancelTitle}
            aria-label={cancelTitle}
            color={cancelColor}
            onClick={() => setEditMode(false)}
            {...props}
         >
            <Close />
         </RoundButton>
      );
   }
}
