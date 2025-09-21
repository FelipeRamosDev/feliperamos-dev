import { OpportunityData } from '@/types/database.types';
import { useState } from 'react';
import { OpportunitiesSearchParams, OpportunityCreateParams } from './useOpportunities.types';
import { useAjax } from '../useAjax';
import { AjaxResponse } from '@/services';

export default function useOpportunities(defaultParams: OpportunitiesSearchParams = {}) {
   const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
   const [selected, setSelected] = useState<OpportunityData | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const ajax = useAjax();

   const fetchOpportunities = async (params: OpportunitiesSearchParams = defaultParams): Promise<OpportunityData[]> => {
      setLoading(true);

      try {
         const loaded = await ajax.get<OpportunityData[]>('/opportunity/search', { params });

         if (loaded.error) {
            throw new Error(loaded.message);
         }

         setOpportunities(loaded.data);
         return loaded.data;
      } catch (error) {
         console.error('Error fetching opportunities:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   }

   const createOpportunity = async (data: Partial<OpportunityCreateParams>): Promise<OpportunityData> => {
      try {
         const created = await ajax.post<OpportunityData>('/opportunity/create', data);

         if (created.error) {
            throw new Error(created.message);
         }

         setOpportunities(prev => [created.data, ...prev]);
         return created.data;
      } catch (error) {
         console.error('Error creating opportunity:', error);
         throw error;
      }
   }

   const updateOpportunity = async (id: number, data: Partial<OpportunityData>): Promise<OpportunityData> => {
      try {
         const updated = await ajax.patch<OpportunityData>('/opportunity/update', { id, updates: data });

         if (updated.error) {
            throw updated;
         }

         if (updated.data.id === selected?.id) {
            setSelected(updated.data);
         }

         setOpportunities(prev => prev.map(item => item.id === updated.data.id ? updated.data : item));
         return updated.data;
      } catch (error) {
         throw error;
      }
   }

   const deleteOpportunity = async (id: number): Promise<AjaxResponse | null> => {
      if (!id) {
         throw new Error('Invalid opportunity ID');
      }

      const confirmDelete = confirm('Are you sure you want to delete this opportunity? This action cannot be undone.');
      if (!confirmDelete) {
         return null;
      }

      try {
         const deleteRelated = confirm('Also delete related data?');
         const deleted = await ajax.delete<OpportunityData[]>('/opportunity/delete', { data: { id, deleteRelated } });

         if (!deleted.success) {
            throw new Error('Error deleting opportunity');
         }

         setOpportunities(prev => prev.filter(item => item.id !== id));
         return deleted;
      } catch (error) {
         console.error('Error deleting opportunity:', error);
         throw error;
      }
   }

   return {
      opportunities,
      loading,
      selected,
      setSelected,
      fetchOpportunities,
      createOpportunity,
      updateOpportunity,
      deleteOpportunity,
   }
}
