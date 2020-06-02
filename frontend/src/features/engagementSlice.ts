import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import toastr from 'toastr';
import { parseISO } from 'date-fns';
import { RootState, AppThunk } from '../app/store';
import { get } from '../service/apiService';
import { EngagementData, engagementsFetchUrl } from '../constants/engagements';

interface EngagementState {
  value: EngagementData[];
}

const initialState: EngagementState = {
  value: [],
};

export const engagementSlice = createSlice({
  name: 'engagement',
  initialState,
  reducers: {
    setEngagements: (state, action: PayloadAction<EngagementData[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setEngagements } = engagementSlice.actions;

const parseEngagement = (engagement: { start: string; end: string }) => ({
  ...engagement,
  start: parseISO(engagement.start),
  end: parseISO(engagement.end),
});

export const fetchEngagements = (
  start: Date,
  end: Date,
  token?: string
): AppThunk => (dispatch) =>
  get(engagementsFetchUrl(start, end), token)
    .then((response) => response.json())
    .then((response) => response.map(parseEngagement))
    .then((response) => dispatch(setEngagements(response)))
    .catch((err) => toastr.error(err));

export const selectEngagement = (state: RootState) => state.engagement.value;

export default engagementSlice.reducer;
