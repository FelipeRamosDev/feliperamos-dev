import { LetterData } from '@/types/database.types';
import { useAjax } from '../useAjax';
import { LetterSearchParams } from './useLetters.types';
import { useState } from 'react';
import { AjaxResponse } from '@/services';

export default function useLetters(defaultParams: LetterSearchParams = {}) {
   const [letters, setLetters] = useState<LetterData[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(null);
   const ajax = useAjax();

   const fetchLetters = async (params: LetterSearchParams = defaultParams): Promise<LetterData[] | Error> => {
      try {
         setLoading(true);
         const loaded = await ajax.get<LetterData[]>('/cover-letter/search/all', { params });

         if (loaded.error) {
            throw new Error(loaded.message || 'Failed to fetch cover letters');
         }

         if (loaded.data && !Array.isArray(loaded.data)) {
            throw new Error('Invalid data format received for cover letters');
         }

         if (!loaded.data) {
            return [];
         }

         setLetters(loaded.data);
         return loaded.data;
      } catch (error) {
         console.error('Error fetching cover letters:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   }

   const createLetter = async (data: Partial<LetterData>): Promise<LetterData> => {
      if (!data) {
         throw new Error('Cover letter data is required for creation');
      }

      try {
         setLoading(true);
         const created = await ajax.post<LetterData>('/cover-letter/create', data);

         if (created.error) {
            throw new Error(created.message);
         }

         return created.data;
      } catch (error) {
         console.error('Error creating cover letter:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   }

   const updateLetter = async (id: number, data: Partial<LetterData>): Promise<LetterData> => {
      if (!id || isNaN(Number(id))) {
         throw new Error('Cover letter ID is required for update');
      }

      try {
         setLoading(true);
         const updated = await ajax.patch<LetterData>(`/cover-letter/update/${id}`, data);

         if (updated.error) {
            throw new Error(updated.message);
         }

         setLetters(prevLetters => prevLetters.map(letter => letter.id === updated.data.id ? updated.data : letter));
         setSelectedLetter(updated.data);

         return updated.data;
      } catch (error) {
         console.error('Error updating cover letter:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   }

   const deleteLetter = async (id: number): Promise<AjaxResponse<LetterData>> => {
      if (!id || isNaN(Number(id))) {
         throw new Error('Cover letter ID is required for deletion');
      }

      try {
         setLoading(true);
         const deleted = await ajax.delete<LetterData>(`/cover-letter/delete/${id}`);

         if (deleted.error) {
            throw new Error(deleted.message);
         }

         setLetters(prevLetters => prevLetters.filter(letter => letter.id !== id));
         if (selectedLetter?.id === id) {
            setSelectedLetter(null);
         }

         return deleted;
      } catch (error) {
         console.error('Error deleting cover letter:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   }

   return {
      loading,
      letters,
      selectedLetter,
      fetchLetters,
      createLetter,
      updateLetter,
      deleteLetter,
      setSelectedLetter
   }
}
