import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import toastr from 'toastr';

import { Employee } from '../model';
import { CreateEmployeeRequest } from '../model/api';
import { get, post, remove } from '../services/apiService';
import { environment } from '../utils/environment';
import { AppThunk, RootState } from './reducer';

const { baseUrl } = environment;

const employeesAdapter = createEntityAdapter<Employee>({
  selectId: ({ id }) => id,
});

const EMPLOYEE_FETCH_URL = `${baseUrl}/staff`;
const EMPLOYEE_DELETE_URL = `${baseUrl}/staff?id=`;
const EMPLOYEE_CREATE_URL = `${baseUrl}/staff`;

export const employeeSlice = createSlice({
  name: 'employee',
  initialState: employeesAdapter.getInitialState(),
  reducers: {
    set: (state, { payload }: PayloadAction<Employee[]>) => {
      employeesAdapter.setAll(state, payload);
    },
    add: (state, { payload }: PayloadAction<Employee>) => {
      employeesAdapter.addOne(state, payload);
    },
  },
});

const { set, add } = employeeSlice.actions;

const updateFromPromise = <T>(
  requestPromise: Promise<Response>,
  dispatch: (payload: { payload: T; type: string }) => void,
  dispatchedFunction: ActionCreatorWithPayload<T, string>
) =>
  requestPromise
    .then(response => response.json())
    .then(response => dispatch(dispatchedFunction(response)))
    .catch(toastr.error);

export const fetchEmployee = (
  token: string | undefined
): AppThunk => dispatch =>
  updateFromPromise(get(EMPLOYEE_FETCH_URL, token), dispatch, set);

export const createEmployee = (
  request: CreateEmployeeRequest,
  token: string | undefined
): AppThunk => dispatch =>
  updateFromPromise(post(EMPLOYEE_CREATE_URL, token, request), dispatch, add);

export const deleteEmployee = (
  id: string,
  token: string | undefined
): AppThunk => dispatch =>
  updateFromPromise(remove(EMPLOYEE_DELETE_URL + id, token), dispatch, set);

const { selectAll } = employeesAdapter.getSelectors<RootState>(
  ({ employee }) => employee
);

export const selectEmployees = selectAll;

export default employeeSlice.reducer;