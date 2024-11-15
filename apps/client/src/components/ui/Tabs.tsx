import Box from '@mui/material/Box';
import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import React, { useCallback, useState } from 'react';

const tabA11yProps = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

interface TabPanelContainerProps {
  $active: boolean;
}

const TabPanelContainer = styled(Box, {
  shouldForwardProp: (propName: PropertyKey) => !propName.toString().startsWith('$')
})<TabPanelContainerProps>(({ theme, $active }) => ({
  display: $active ? 'flex' : 'none',
  flex: 1,
  flexDirection: 'column'
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index, ...rest }: TabPanelProps) => (
  <TabPanelContainer
    $active={value === index}
    p={3}
    role="tabpanel"
    id={`tabpanel-${index}`}
    aria-labelledby={`tab-${index}`}
    {...rest}
  >
    {value === index && children}
  </TabPanelContainer>
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
            <MuiTab label={label} disabled={disabled} {...tabA11yProps(index)} key={index}/>
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
