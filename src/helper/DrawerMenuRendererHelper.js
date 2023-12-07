import React from 'react';
import {
  HOME,
  DRAWER_COLUMN_TOTAL_HEIGHT,
  ACCOUNTS,
  CONTACTS,
  CALENDAR,
} from '../variables/constants';
import {
  DRAWER_SECTION_BACKGROUND_COLOR,
  DRAWER_SECTION_HEADER_BACKGROUND_COLOR,
  DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR,
  DRAWER_SECTION_HEADER_IMAGE_COLOR,
  DRAWER_SECTION_HEADER_TEXT_COLOR,
} from '../variables/themeColors';
import ImageButton from '../components/drawer/components/imageButton';
import Menu from '../components/drawer/components/menu';
import Section from '../components/common/section';
import SectionHolder from '../components/drawer/components/sectionHolder';
import MenuHolder from '../components/drawer/layouts/menuHolder';

const hiddenModules = ['RecycleBin', 'EmailTemplates', 'Reports'];

export const renderDrawerContent = (data) => {
  let menu = data?.menu;

  let homeTitle = data?.homeTitle;

  let itemNew = [];

  const moduleNames = ['Contacts', 'Accounts', 'Calendar'];

  for (let moduleName of moduleNames) {
    const module = data?.modules.find((module) => module?.name === moduleName);
    if (module) {
      itemNew.push(module);
    }
  }

  return [...createFixedMenu(itemNew, homeTitle), ...createDynamicMenu(menu)];
};

const createFixedMenu = (itemNew, homeTitle) => {
  let homeButtonView = wrapButtonInMenuComponent(
    <ImageButton
      type={HOME}
      label={homeTitle ? homeTitle : 'Home'}
      key="home_menu"
      icon={'home'}
    />,
    'menu1',
  );

  let mainMenu = itemNew.map((val) => {
    return wrapButtonInMenuComponent(
      <ImageButton
        type={val?.name}
        label={val?.label}
        module={{
          name: val?.name,
          label: val?.label,
          id: val?.id,
        }}
        key={
          val?.name === 'Contacts'
            ? 'contact_menu'
            : val?.name === 'Accounts'
            ? 'account_menu'
            : val?.name === 'Calendar'
            ? 'calendar'
            : null
        }
        icon={
          val?.name === 'Contacts'
            ? 'user'
            : val?.name === 'Accounts'
            ? 'building'
            : val?.name === 'Calendar'
            ? 'calendar-alt'
            : null
        }
      />,
      val?.name === 'Contacts'
        ? 'menu2'
        : val?.name === 'Accounts'
        ? 'menu3'
        : val?.name === 'Calendar'
        ? 'menu4'
        : null,
    );
  });

  // // Create Home button

  // // Create Contacts button
  // let contactsButtonView = wrapButtonInMenuComponent(
  // <ImageButton
  //   type={CONTACTS}
  //   label={CONTACTS}
  //   module={{
  //     name: 'Contacts',
  //     label: 'Contacts',
  //     id: 12,
  //   }}
  //   key="contact_menu"
  //   icon={'user'}
  // />,
  //   'menu2',
  // );

  // // Create Accounts button
  // let accountsButtonView = wrapButtonInMenuComponent(
  //   <ImageButton
  //     type={ACCOUNTS}
  //     label={'Organizations'}
  //     module={{
  //       name: 'Accounts',
  //       label: 'Organizations',
  //       id: 11,
  //     }}
  //     key="account_menu"
  //     icon={'building'}
  //   />,
  //   'menu3',
  // );

  // // Create Calendar button
  // let calendarButtonView = wrapButtonInMenuComponent(
  //   <ImageButton
  //     type={CALENDAR}
  //     label={'Calendar'}
  //     module={{
  //       name: 'Calendar',
  //       label: 'Calendar',
  //       id: 9,
  //     }}
  //     key="calendar"
  //     icon={'calendar-alt'}
  //   />,
  //   'menu4',
  // );

  return [
    homeButtonView,
    mainMenu,
    // contactsButtonView,
    // accountsButtonView,
    // calendarButtonView,
  ];
};

const createDynamicMenu = (menu) => {
  const sectionViews = [];
  for (const section of menu) {
    const moduleButtonViews = createModuleButtonViews(section);
    const newSection = (
      <Section
        drawerMenu={true}
        sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
        sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
        sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
        sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
        sectionHeaderImageSelectedColor={
          DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR
        }
        headerName={section.label}
        imageName={section.label}
        headerImage
        content={createModuleButtonViews(section)}
        contentHeight={moduleButtonViews.length * DRAWER_COLUMN_TOTAL_HEIGHT}
        key={section.name + '_section'}
      />
    );

    sectionViews.push(
      <SectionHolder key={section.name + 'section_holder'}>
        {newSection}
      </SectionHolder>,
    );
  }

  return sectionViews;
};

const createModuleButtonViews = (section) => {
  const moduleButtonViews = [];
  for (let module of section.modules) {
    if (hiddenModules.includes(module.name)) continue;

    // TEMP
    if (module.name === 'Potentials' && module.id === '2') module.id = '13';

    moduleButtonViews.push(<MenuHolder key={module.name} module={module} />);
  }

  return moduleButtonViews;
};

const wrapButtonInMenuComponent = (button, key) => {
  return <Menu key={key}>{button}</Menu>;
};
