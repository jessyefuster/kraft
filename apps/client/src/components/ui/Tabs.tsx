import Box from '@mui/material/Box';
import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import React, { useCallback, useState } from 'react';

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...rest }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...rest}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    )}
  </div>
);

export interface Tab {
  label: string;
  component: React.ReactNode;
  disabled?: boolean;
}

interface Props {
  tabs: Tab[];
}

const Tabs = ({ tabs }: Props) => {
  const [value, setValue] = useState(0);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) =>
    setValue(newValue)
  , []);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
          {tabs.map(({ label, disabled }, index) => (
            <MuiTab label={label} disabled={disabled} {...a11yProps(index)} key={index}/>
          ))}
        </MuiTabs>
      </Box>
      {tabs.map(({ component }, index) => (
        <TabPanel index={index} value={value} key={index}>{component}</TabPanel>
      ))}
    </>
  );
};

export default Tabs;
