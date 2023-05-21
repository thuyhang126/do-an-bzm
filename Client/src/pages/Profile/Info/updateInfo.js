import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { useForm, Controller } from 'react-hook-form';
import appConfig from '../../../config/appConfig';
import { useCrxFetch } from '../../../hooks/useCrxFetch';

import './index.css';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const dataPosition = [
  { label: 'Giám đốc điều hành' },
  { label: 'Giám đốc tài chính' },
  { label: 'Giám đốc Marketing' },
  { label: 'Giám đốc thương mại' },
  { label: 'Giám đốc vận hành' },
  { label: 'Trưởng phòng' },
  { label: 'Nhân viên' },
  { label: 'staff' },
];

function UpdateInfo({ user, setUser, setUpdateInfo }) {
  user = {
    ...user,
    purpose: JSON.parse(user.purpose),
    business_model: JSON.parse(user.business_model),
  };

  const crxFetch = useCrxFetch();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      birthday: user.birthday,
      position: user.position,
      company: user.company,
      purpose: user.purpose,
      descriptions: user.descriptions,
      business_model: user.business_model,
    },
  });

  const onSubmit = (data) => {
    var bodyFormData = new FormData();
    bodyFormData.append('name', data.name);
    bodyFormData.append('birthday', data.birthday);
    bodyFormData.append('position', data.position);
    bodyFormData.append('company', data.company);
    bodyFormData.append('descriptions', data.descriptions);
    bodyFormData.append('purpose', JSON.stringify(data.purpose));
    bodyFormData.append('business_model', JSON.stringify(data.business_model));
    crxFetch
      .put(appConfig.updateProfile, bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setUser(res.data.data.user);
        setUpdateInfo(false);
      });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box
        className="form"
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '60%' },
        }}
        noValidate
        autoComplete="off"
      >
        <Box>1. Họ và tên</Box>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: {} }) => (
            <TextField
              id="Name"
              defaultValue={user.name}
              onChange={(e) => setValue('name', e.target.value)}
              variant="outlined"
            />
          )}
          name="name"
        />
        {errors.name && <div className="err">This is required.</div>}
        <Box>2. Ngày tháng năm sinh</Box>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: {} }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                <DatePicker
                  label="Birthday"
                  defaultValue={dayjs(user.birthday)}
                  onChange={(newInputValue) => setValue('birthday', newInputValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          )}
          name="birthday"
        />
        {errors.birthday && <div className="err">This is required.</div>}
        <Box>3. Chức vụ</Box>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: {} }) => (
            <Autocomplete
              disablePortal
              id="position"
              defaultValue={{ label: user.position }}
              onInputChange={(event, newInputValue) => {
                setValue('position', newInputValue);
              }}
              options={dataPosition}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} placeholder="Chọn chức vụ" />}
            />
          )}
          name="position"
        />
        {errors.position && <div className="err">This is required.</div>}
        <Box>4. Tên tổ chức, công ty</Box>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: {} }) => (
            <TextField
              id="Company"
              defaultValue={user.company}
              onChange={(e) => setValue('company', e.target.value)}
              variant="outlined"
            />
          )}
          name="company"
        />
        {errors.company && <div className="err">This is required.</div>}
        <Box>5. Mục đích sử dụng</Box>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: {} }) => (
            <Box className="list_item">
              {user.purpose?.map((item, i) => (
                <box className="item_detail" key={item.id}>
                  <Checkbox
                    {...label}
                    defaultChecked={item.isChecked}
                    onChange={(e) => {
                      user.purpose[i].isChecked = !item.isChecked;
                      setValue('purpose', user.purpose);
                    }}
                  />
                  <p>{item.label} </p>
                </box>
              ))}
            </Box>
          )}
          name="purpose"
        />
        {errors.purpose && <div className="err">This is required.</div>}
        <Box>6. Mô tả</Box>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: {} }) => (
            <TextField
              id="description"
              defaultValue={user.descriptions}
              onChange={(e) => setValue('descriptions', e.target.value)}
              variant="outlined"
            />
          )}
          name="descriptions"
        />
        {errors.descriptions && <div className="err">This is required.</div>}
        <Box>7. Lĩnh vực kinh doanh</Box>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: {} }) => (
            <Box className="list_item">
              {user.business_model?.map((item, i) => (
                <Box className="item_detail" key={item.id}>
                  <Checkbox
                    {...label}
                    defaultChecked={item.isChecked}
                    onChange={(e) => {
                      user.business_model[i].isChecked = !item.isChecked;
                      setValue('business_model', user.business_model);
                    }}
                  />
                  <p>{item.label} </p>
                </Box>
              ))}
            </Box>
          )}
          name="business_model"
        />
        {errors.business_model && <div className="err">This is required.</div>}
      </Box>
      <input type="submit" className="save-info" value="Save" />
    </form>
  );
}
export default UpdateInfo;
