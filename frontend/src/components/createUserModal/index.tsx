import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Clear from '@material-ui/icons/Clear';

import { createStaff } from '../../features/staffSlice';
import { toDateStr } from '../../constants/global';

import 'toastr/build/toastr.min.css';
import createUserModalStyle from './createUserModal.module.scss';

interface Props {
  closeModalFunction: () => void;
}

interface TextField {
  id: string;
  name: string;
  type: string;
}

const textFields: TextField[] = [
  { id: 'firstName', name: 'First Name', type: 'text' },
  { id: 'surname', name: 'Surname', type: 'text' },
  { id: 'jobTitle', name: 'Job title', type: 'text' },
  { id: 'contractedHours', name: 'Contracted hours', type: 'number' },
  { id: 'pay', name: 'Pay', type: 'number' },
];

const CreateUserModal = ({ closeModalFunction }: Props) => {
  const dispatch = useDispatch();
  const [preferredDays, setPreferredDays] = useState<{
    [key: string]: boolean;
  }>({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  const [userInfo, setUserInfo] = useState<{ [key: string]: string | number }>({
    firstName: '',
    surname: '',
    jobTitle: '',
    role: 'USER',
    contractedHours: 0,
    pay: 0,
  });

  const handlePreferredDaysChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPreferredDays({
      ...preferredDays,
      [event.target.name]: event.target.checked,
    });
  };

  const updateUserInfo = (userField: string, newValue: string | number) => {
    setUserInfo({
      ...userInfo,
      [userField]: newValue,
    });
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userField = event.target.name as string;
    const newValueString = event.target.value as string;
    let newValue: string | number;

    if (event.target.type === 'number') {
      newValue = parseFloat(newValueString);
    } else {
      newValue = newValueString;
    }

    updateUserInfo(userField, newValue);
  };

  const handleDropdownChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => {
    const userField = event.target.name as string;
    const newValue = event.target.value as string | number;
    updateUserInfo(userField, newValue);
  };

  const handleCreateClick = () => {
    const prefDaysString = Object.values(preferredDays)
      .map((preferred) => +preferred)
      .join('');
    dispatch(
      createStaff({
        firstName: userInfo.firstName as string,
        surname: userInfo.surname as string,
        jobTitle: userInfo.jobTitle as string,
        role: userInfo.role as 'USER' | 'MANAGER',
        contractedHours: userInfo.contractedHours as number,
        pay: userInfo.pay as number,
        preferredDates: prefDaysString,
        startDate: toDateStr(new Date()),
      })
    );
    closeModalFunction();
  };

  return (
    <>
      <div className={createUserModalStyle.header}>
        <h4>Create</h4>
        <button
          type="button"
          aria-label="closeButton"
          className={createUserModalStyle.xButton}
          onClick={closeModalFunction}>
          <Clear />
        </button>
      </div>
      <hr />
      <div className={createUserModalStyle.form}>
        <div className={createUserModalStyle.formLeft}>
          {textFields.map((field) => (
            <span key={field.id} className={createUserModalStyle.field}>
              <TextField
                id="outlined-basic"
                label={field.name}
                variant="outlined"
                type={field.type}
                value={userInfo[field.id]}
                name={field.id}
                onChange={handleTextFieldChange}
              />
            </span>
          ))}
          <span className={createUserModalStyle.field}>
            <Select
              id="demo-simple-select-outlined"
              value={userInfo.role}
              name="user"
              onChange={handleDropdownChange}
              label="Role"
              variant="outlined">
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
            </Select>
          </span>
        </div>
        <div className={createUserModalStyle.formRight}>
          <FormGroup>
            <FormLabel component="legend">Preferred days</FormLabel>
            {Object.entries(preferredDays).map(([day, selected]) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={selected}
                    onChange={handlePreferredDaysChange}
                    name={day}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </div>
      </div>
      <div className={createUserModalStyle.buttons}>
        <Button variant="contained" onClick={closeModalFunction}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateClick}
          color="secondary">
          CREATE
        </Button>
      </div>
    </>
  );
};

export default CreateUserModal;
