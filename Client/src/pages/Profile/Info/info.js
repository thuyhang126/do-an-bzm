import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';

import './index.css';
import appConfig from '../../../config/appConfig';

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

function Info({ user, setUpdateInfo }) {
  user = {
    ...user,
    purpose: user.purpose ? JSON.parse(user.purpose) : appConfig.purpose,
    business_model: user.business_model ? JSON.parse(user.business_model) : appConfig.businessModels,
  };
  console.log(user.purpose, user.business_model); 


  return (
    <>
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
        <TextField id="Name" value={user.name} variant="outlined" />
        <Box>2. Ngày tháng năm sinh</Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
            <DatePicker value={dayjs(user.birthday)} />
          </DemoContainer>
        </LocalizationProvider>
        <Box>3. Chức vụ</Box>
        <Autocomplete
          disablePortal
          id="position"
          value={{ label: user.position || ""}}
          options={dataPosition}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} placeholder="Chọn chức vụ" />}
        />
        <Box>4. Tên tổ chức, công ty</Box>
        <TextField id="Company" value={user.company} variant="outlined" />
        <Box>5. Mục đích sử dụng</Box>
        <Box className="list_item">
          {user.purpose?.map((item) => (
            <box className="item_detail" key={item.id}>
              <Checkbox {...label} checked={item.isChecked} />
              <p>{item.label} </p>
            </box>
          ))}
        </Box>
        <Box>6. Mô tả</Box>
        <TextField id="description" value={user.descriptions} variant="outlined" />
        <Box>7. Lĩnh vực kinh doanh</Box>
        <Box className="list_item">
          {user.business_model?.map((model) => (
            <Box className="item_detail" key={model.id}>
              <Checkbox {...label} checked={model.isChecked} />
              <p>{model.label} </p>
            </Box>
          ))}
        </Box>
      </Box>
      <input type="submit" className="save-info" value="Edit" onClick={() => setUpdateInfo(true)} />
    </>
  );
}
export default Info;
