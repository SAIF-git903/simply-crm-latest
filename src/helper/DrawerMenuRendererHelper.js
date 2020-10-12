import React from 'react';
import {
    HOME,
    DRAWER_COLUMN_TOTAL_HEIGHT,
    ACCOUNTS,
    CONTACTS,
    CALENDAR
} from '../variables/constants';
import {
    DRAWER_SECTION_BACKGROUND_COLOR, DRAWER_SECTION_HEADER_BACKGROUND_COLOR,
    DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR, DRAWER_SECTION_HEADER_IMAGE_COLOR,
    DRAWER_SECTION_HEADER_TEXT_COLOR
} from '../variables/themeColors';
import ImageButton from '../components/drawer/components/imageButton';
import Menu from '../components/drawer/components/menu';
import Section from '../components/common/section';
import SectionHolder from '../components/drawer/components/sectionHolder';
import MenuHolder from '../components/drawer/layouts/menuHolder';

const hiddenModules = [
    'RecycleBin',
    'EmailTemplates',
    'Reports'
]

export const renderDrawerContent = (menu) => {
    return [...createFixedMenu(), ...createDynamicMenu(menu)];
};

const createFixedMenu = () => {
    // Create Home button
    let homeButtonView = wrapButtonInMenuComponent(
        <ImageButton
            type={HOME}
            label={HOME}
            key='home_menu'
            icon={'home'}
        />,
        'menu1'
    );

    // Create Contacts button
    let contactsButtonView = wrapButtonInMenuComponent(
        <ImageButton
            type={CONTACTS}
            label={CONTACTS}
            module={{
                name: 'Contacts',
                label: 'Contacts',
                id: 12,
            }}
            key='contact_menu'
            icon={'user'}
        />,
        'menu2'
    );

    // Create Accounts button
    let accountsButtonView = wrapButtonInMenuComponent(
        <ImageButton
            type={ACCOUNTS}
            label={'Organizations'}
            module={{
                name: 'Accounts',
                label: 'Organizations',
                id: 11,
            }}
            key='account_menu'
            icon={'building'}
        />,
        'menu3'
    );

    // Create Calendar button
    let calendarButtonView = wrapButtonInMenuComponent(
        <ImageButton
            type={CALENDAR}
            label={'Calendar'}
            module={{
                name: 'Calendar',
                label: 'Calendar',
                id: 9,
            }}
            key='calendar'
            icon={'calendar-alt'}
        />,
        'menu4'
    );

    return [
        homeButtonView,
        contactsButtonView,
        accountsButtonView,
        calendarButtonView
    ];
};

const createDynamicMenu = (menu) => {
    const sectionViews = [];
    for (const section of menu) {
        const moduleButtonViews = createModuleButtonViews(section);
        const newSection = <Section
            drawerMenu={true}
            sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
            sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
            sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
            sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
            sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
            headerName={section.label}
            imageName={section.label}
            headerImage
            content={createModuleButtonViews(section)}
            contentHeight={moduleButtonViews.length * DRAWER_COLUMN_TOTAL_HEIGHT}
            key={section.name + '_section'} />;

        sectionViews.push(<SectionHolder key={section.name + 'section_holder'}>{newSection}</SectionHolder>);
    }

    return sectionViews;
};

const createModuleButtonViews = (section) => {
    const moduleButtonViews = [];
    for (let module of section.modules) {
        if (hiddenModules.includes(module.name)) continue;

        // TEMP
        if (module.name === 'Potentials' && module.id === '2') module.id = '13';

        moduleButtonViews.push(<MenuHolder key={module.name} module={module} />)
    }

    return moduleButtonViews;
};

const wrapButtonInMenuComponent = (button, key) => {
    return <Menu key={key}>{button}</Menu>
};