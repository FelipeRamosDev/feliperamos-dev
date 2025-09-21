import { LetterData } from '@/types/database.types';
import { useAjax } from '../useAjax';
import { LetterSearchParams } from './useCoverLetter.types';
import { useState } from 'react';
import { AjaxResponse } from '@/services';

export default function useConverLetters(defaultParams: LetterSearchParams) {
   const [coverLetters, setCoverLetters] = useState<LetterData[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const ajax = useAjax();

   const fetchCoverLetters = async (params: LetterSearchParams = defaultParams): Promise<LetterData[] | Error> => {
      try {
         setLoading(true);
         const letters = await ajax.get<LetterData[]>('/cover-letter/search', { params });

         if (letters.error) {
            throw new Error(letters.message || 'Failed to fetch cover letters');
         }

         if (letters.data && !Array.isArray(letters.data)) {
            throw new Error('Invalid data format received for cover letters');
         }

         if (!letters.data) {
            return [];
         }

         setCoverLetters(letters.data);
         return letters.data;
      } catch (error) {
         console.error('Error fetching cover letters:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   }

   const createCoverLetter = async (data: Partial<LetterData>): Promise<LetterData> => {
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

   const updateCoverLetter = async (id: number, data: Partial<LetterData>): Promise<LetterData> => {
      if (!id || isNaN(Number(id))) {
         throw new Error('Cover letter ID is required for update');
      }

      try {
         setLoading(true);
         const updated = await ajax.patch<LetterData>(`/cover-letter/update/${id}`, data);

         if (updated.error) {
            throw new Error(updated.message);
         }

         return updated.data;
      } catch (error) {
         console.error('Error updating cover letter:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   }

   const deleteCoverLetter = async (id: number): Promise<AjaxResponse<LetterData>> => {
      if (!id || isNaN(Number(id))) {
         throw new Error('Cover letter ID is required for deletion');
      }

      try {
         setLoading(true);
         const deleted = await ajax.delete<LetterData>(`/cover-letter/delete/${id}`);
   
         if (deleted.error) {
            throw new Error(deleted.message);
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
      coverLetters,
      fetchCoverLetters,
      createCoverLetter,
      updateCoverLetter,
      deleteCoverLetter
   }
}
