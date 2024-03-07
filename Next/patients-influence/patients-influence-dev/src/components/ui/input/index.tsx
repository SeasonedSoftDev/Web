import React, { useState } from 'react';
import {
  InputMain,
  InputLabel,
  InputSelect,
  InputText,
  InputMultiSelect,
  InputDatepicker,
  InputTimepicker,
  InputRow,
  InputError,
  InputChip,
  MultiSelectInputContainer,
} from 'components/ui/input/styles';
import { TInputProps } from 'components/ui/input/types';
import { Chip, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import kebabCase from 'utilities/kebab-case';

const Input = ({
  label,
  type = 'text',
  value,
  onValue,
  min,
  max,
  options = [],
  placeholder,
  multiline,
  required,
  helper,
  rows,
  validators = [],
  shouldValidate = true,
  errorCallback,
  onBlur,
  onFocus,
  startAdornment,
  endAdornment,
  disabled,
  minRows,
  maxRows,
  onNewTag,
  initialSearch = '',
  onSearch,
  loading = false,
  noOptionsText,
  customDateFormat,
  isFilterActive = false,
  ...props
}: TInputProps) => {
  const [search, setSearch] = useState(initialSearch);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [disabledNewTag, setDisabledNewTag] = useState(false);

  const handleValue = (e: React.ChangeEvent<any>) => {
    if (onValue) onValue(e.target.value);
  };

  const handleSelect = (_e: React.ChangeEvent<any>, v: any) => {
    if (onValue) onValue(v);
  };

  const handleMultiselect = (_e: React.ChangeEvent<any>, v: any) => {
    if (onValue) onValue(v);
  };

  const handleDate = (newValue: any) => {
    if (onValue) onValue(newValue);
  };

  const handleMinMax = (key: 'min' | 'max') => (e: React.ChangeEvent<any>) => {
    if (onValue) onValue({ ...value, [key]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    for (let i = 0; i < validators.length; i += 1) {
      const v = validators[i];
      if (!v.validator(value)) {
        setErrorMessage(v.message);
        setError(true);
        if (errorCallback) errorCallback(true);
        if (onBlur) onBlur(e);
        return;
      }
    }
    if (errorCallback) errorCallback(false);
    if (onBlur) onBlur(e);
  };

  const handleSearch = (x: string) => {
    if (onSearch) {
      onSearch(x);
    }

    setSearch(x);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setError(false);
    setErrorMessage('');
    if (onFocus) onFocus(e);
  };

  const handleKeyDown = (e: any) => {
    if (
      e.key === 'Enter' &&
      onNewTag &&
      e.target.value.trim() &&
      !disabledNewTag
    ) {
      const newValue = kebabCase(e.target.value);
      if (options.find((x) => x.value === newValue)) {
        return;
      }
      onNewTag({
        label: e.target.value,
        value: newValue,
      });
      setSearch('');
    } else if (['ArrowDown', 'ArrowUp'].includes(e.key) && !disabledNewTag) {
      setDisabledNewTag(true);
    } else {
      setDisabledNewTag(false);
    }
  };

  return (
    <InputMain {...props}>
      {!!label && (
        <InputLabel required={required} helper={helper}>
          {label}
        </InputLabel>
      )}
      {type === 'text' && (
        <InputText
          type="text"
          value={value}
          onChange={handleValue}
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          minRows={minRows}
          maxRows={maxRows}
          variant="outlined"
          error={error}
          autoComplete="on"
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          InputProps={{ startAdornment, endAdornment }}
        />
      )}
      {type === 'password' && (
        <InputText
          type="password"
          value={value}
          onChange={handleValue}
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          minRows={minRows}
          maxRows={maxRows}
          variant="outlined"
          error={error}
          autoComplete="on"
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          InputProps={{ startAdornment, endAdornment }}
        />
      )}
      {type === 'number' && (
        <InputText
          type="number"
          value={value}
          onChange={handleValue}
          placeholder={placeholder}
          multiline={multiline}
          rows={rows}
          minRows={minRows}
          maxRows={maxRows}
          variant="outlined"
          error={error}
          disabled={disabled}
          InputProps={{
            startAdornment,
            endAdornment,
            inputProps: { min, max },
          }}
        />
      )}
      {type === 'min-max' && (
        <InputRow>
          <InputText
            type="number"
            value={value.min}
            onChange={handleMinMax('min')}
            placeholder="Min"
            multiline={multiline}
            rows={rows}
            minRows={minRows}
            maxRows={maxRows}
            variant="outlined"
            error={error}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            InputProps={{
              startAdornment,
              endAdornment,
              inputProps: { max: value.max },
            }}
          />
          <span style={{ alignSelf: 'center' }}>-</span>
          <InputText
            type="number"
            value={value.max}
            onChange={handleMinMax('max')}
            placeholder="Max"
            multiline={multiline}
            rows={rows}
            minRows={minRows}
            maxRows={maxRows}
            variant="outlined"
            error={error}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            InputProps={{
              startAdornment,
              endAdornment,
              inputProps: { min: value.min },
            }}
          />
        </InputRow>
      )}
      {type === 'select' && (
        <InputSelect
          options={options}
          getOptionLabel={(option: any) => (option ? option.label : '')}
          value={value}
          autoComplete={false}
          onChange={handleSelect}
          inputValue={search}
          disabled={disabled}
          onInputChange={(_a, b) => handleSearch(b)}
          loading={loading}
          filterOptions={isFilterActive ? (x) => x : undefined}
          noOptionsText={noOptionsText}
          isOptionEqualToValue={(a: any, b: any) => a.value === b.value}
          renderOption={(optionProps, option: any) => (
            <MenuItem key={option.value} {...optionProps}>
              {option.label}
            </MenuItem>
          )}
          renderInput={({
            InputProps: { endAdornment: _endAdornment, ...InputProps },
            ...x
          }) => (
            <InputText
              {...x}
              variant="outlined"
              placeholder={placeholder}
              error={error}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled}
              // onKeyDown={handleKeyDown}
              InputProps={{
                ...InputProps,
                startAdornment,
                endAdornment: [endAdornment, _endAdornment],
              }}
            />
          )}
        />
      )}
      {type === 'date' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <InputDatepicker
            inputFormat={customDateFormat || 'MM/DD/YYYY'}
            value={value}
            onChange={handleDate}
            disabled={disabled}
            minDate={min}
            maxDate={max}
            renderInput={({ inputProps, ...x }) => (
              <InputText
                {...x}
                variant="outlined"
                error={error}
                onBlur={handleBlur}
                onFocus={handleFocus}
                disabled={disabled}
                inputProps={{ ...inputProps, placeholder }}
              />
            )}
          />
        </LocalizationProvider>
      )}
      {type === 'time' && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <InputTimepicker
            inputFormat="HH:MM"
            value={value}
            onChange={handleDate}
            disabled={disabled}
            renderInput={({ inputProps, ...x }) => (
              <InputText
                {...x}
                variant="outlined"
                error={error}
                onBlur={handleBlur}
                onFocus={handleFocus}
                inputProps={{ ...inputProps, placeholder }}
              />
            )}
          />
        </LocalizationProvider>
      )}
      {type === 'multiselect' && (
        <MultiSelectInputContainer disabled={disabled}>
          <InputMultiSelect
            multiple
            autoComplete={false}
            filterSelectedOptions
            options={options}
            getOptionLabel={
              (option: any) => (option ? option.label : '')
              // const opt = options.find((x) => x.value === option.value);
              // if (!opt) {
              //   return '';
              // }
              // return opt.label;
            }
            noOptionsText={noOptionsText}
            value={value}
            onChange={handleMultiselect}
            filterOptions={isFilterActive ? (x) => x : undefined}
            inputValue={search}
            disabled={disabled}
            onInputChange={(_a, b) => handleSearch(b)}
            loading={loading}
            isOptionEqualToValue={(a: any, b: any) => a.value === b.value}
            renderTags={(v: any[], getTagProps) =>
              v.map((option: any, index: number) => (
                <InputChip
                  label={option.label}
                  color="info"
                  variant="outlined"
                  {...getTagProps({ index })}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                />
              ))
            }
            renderOption={(optionProps, option: any) => (
              <MenuItem key={option.value} {...optionProps}>
                {option.label}
              </MenuItem>
            )}
            renderInput={({
              InputProps: {
                endAdornment: _endAdornment,
                startAdornment: _startAdornment,
                ...InputProps
              },
              ...x
            }) => (
              <InputText
                {...x}
                variant="outlined"
                placeholder={options ? placeholder : ''}
                error={error}
                onBlur={handleBlur}
                onFocus={handleFocus}
                disabled={disabled}
                onKeyDown={handleKeyDown}
                InputProps={{
                  ...InputProps,
                  endAdornment: [endAdornment, _endAdornment],
                  startAdornment: [startAdornment, _startAdornment],
                }}
              />
            )}
          />
        </MultiSelectInputContainer>
      )}
      {error && <InputError>{errorMessage}</InputError>}
    </InputMain>
  );
};

export default Input;
