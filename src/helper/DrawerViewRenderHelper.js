import React from 'react';
import {
    HOME, LOGOUT, MARKETING, SALES, INVENTORY, TOOLS,
    SUPPORT, PROJECT, CUSTOM, CALENDAR, MARKETING_IMAGE, SALES_IMAGE, INVENTORY_IMAGE,
    SUPPORT_IMAGE, PROJECT_IMAGE, CUSTOM_IMAGE,
    DRAWER_COLUMN_TOTAL_HEIGHT, ACCOUNTS, LEADS, CAMPAIGNS, CONTACTS, QUOTES, PRODUCTS,
    SERVICES, ASSETS, SMS_NOTIFIER, OPPORTUNITIES, SALESORDER,
    INVOICE, VENDORS, PRICEBOOKS, PURCHASEORDER, TICKETS,
    FAQ, SERVICECONTRACTS, MODULE_PROJECT, PROJECT_TASK, PROJECT_MILESTONE,
    PBXMANAGER,
    DOCUMENTS, REPORTS, EMAILS, TOOLS_IMAGE
} from '../variables/constants';
import ImageButton from '../components/drawer/components/imageButton';
import Menu from '../components/drawer/components/menu';
import Section from '../components/common/section';
import SectionHolder from '../components/drawer/components/sectionHolder';
import {
    DRAWER_SECTION_BACKGROUND_COLOR, DRAWER_SECTION_HEADER_BACKGROUND_COLOR,
    DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR, DRAWER_SECTION_HEADER_IMAGE_COLOR,
    DRAWER_SECTION_HEADER_TEXT_COLOR
} from '../variables/themeColors';
import MenuHolder from '../components/drawer/layouts/menuHolder';

export const renderDrawerView = async (loginDetails, drawerInstance) => {
    const drawerViews = [];


    //.................................................................................

    let homeButton = <ImageButton
        type={HOME}
        label={HOME}
        key='home_menu'
        icon={'home'}
    />;

    let menuButtons = [homeButton];

    let menu = <Menu key='menu1'>{menuButtons}</Menu>;

    drawerViews.push(menu);

    // console.log(loginDetails);
    for (const module of loginDetails.modules) {
        if (module.name === CONTACTS) {
            homeButton = <ImageButton
                type={CONTACTS}
                label={module.label}
                module={module}
                key='contact_menu'
                icon={'user'}
            />;

            menuButtons = [homeButton];

            menu = <Menu key='menu2'>{menuButtons}</Menu>;

            drawerViews.push(menu);
        }

        if (module.name === ACCOUNTS) {
            homeButton = <ImageButton
                type={ACCOUNTS}
                label={module.label}
                module={module}
                key='account_menu'
                icon={'building'}
            />;

            menuButtons = [homeButton];

            menu = <Menu key='menu3'>{menuButtons}</Menu>;

            drawerViews.push(menu);
        }
    }

    //..................................................................................

    const marketSectionContent = [];
    const salesSectionContent = [];
    const inventorySectionContent = [];
    const supportSectionContent = [];
    const projectSectionContent = [];
    const toolsSectionContent = [];
    const customSectionContent = [];

    // console.log('Modules', loginDetails.modules);

    getSectionContent(marketSectionContent, salesSectionContent, inventorySectionContent,
        supportSectionContent, projectSectionContent, toolsSectionContent, customSectionContent, loginDetails.modules);

    const marketingSection = (<Section
        drawerMenu={true}
        sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
        sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
        sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
        sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
        sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
        headerName={MARKETING} imageName={MARKETING_IMAGE}
        headerImage content={marketSectionContent}
        contentHeight={marketSectionContent[0].length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);

    const salesSection = (<Section
        drawerMenu={true}
        sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
        sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
        sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
        sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
        sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
        headerName={SALES} imageName={SALES_IMAGE}
        headerImage content={salesSectionContent}
        contentHeight={salesSectionContent[0].length * DRAWER_COLUMN_TOTAL_HEIGHT}
        key='sales_section'
    />);

    const inventorySection = (<Section
        drawerMenu={true}
        sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
        sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
        sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
        sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
        sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
        headerName={INVENTORY} imageName={INVENTORY_IMAGE}
        headerImage content={inventorySectionContent}
        contentHeight={inventorySectionContent[0].length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);

    const supportSection = (<Section
        drawerMenu={true}
        sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
        sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
        sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
        sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
        sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
        headerName={SUPPORT} imageName={SUPPORT_IMAGE}
        headerImage content={supportSectionContent}
        contentHeight={supportSectionContent[0].length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);

    const projectSection = (<Section
        drawerMenu={true}
        sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
        sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
        sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
        sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
        sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
        headerName={PROJECT} imageName={PROJECT_IMAGE}
        headerImage content={projectSectionContent}
        contentHeight={projectSectionContent.length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);

    const toolsSection = (<Section
        drawerMenu={true}
        sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
        sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
        sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
        sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
        sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
        headerName={TOOLS} imageName={TOOLS_IMAGE}
        headerImage content={toolsSectionContent}
        contentHeight={toolsSectionContent[0].length * DRAWER_COLUMN_TOTAL_HEIGHT}
        key='tools_section'
    />);

    const customSection = (<Section
        drawerMenu={true}
        sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
        sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
        sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
        sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
        sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
        headerName={CUSTOM} imageName={CUSTOM_IMAGE}
        headerImage content={customSectionContent}
        contentHeight={customSectionContent[0].length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);

    // console.log('len', marketSectionContent.length);
    const section = [];
    if (marketSectionContent.length > 0) {
        //section.push(marketingSection);
    }

    if (salesSectionContent.length > 0) {
        section.push(salesSection);
    }

    if (inventorySectionContent.length > 0) {
        // section.push(inventorySection);
    }

    if (supportSectionContent.length > 0) {
        //section.push(supportSection);
    }

    if (projectSectionContent.length > 0) {
        //section.push(projectSection);
    }

    if (toolsSectionContent.length > 0) {
        section.push(toolsSection);
    }

    if (customSectionContent.length > 0) {
        //section.push(customSection);
    }

    const sectionHolder = <SectionHolder key='section_holder'>{section}</SectionHolder>;

    drawerViews.push(sectionHolder);

    drawerInstance.setState({ drawerLoadComplete: true, loading: false, drawerViews });
};

const getSectionContent = (marketingSectionContent, salesSectionContent, inventorySectionContent,
    supportSectionContent, projectSectionContent, toolsSectionContent, customSectionContent, modules) => {
    const marketModulesButtons = [];
    const salesModulesButtons = [];
    const inventoryModulesButtons = [];
    const supportModulesButtons = [];
    const projectModulesButtons = [];
    const toolsModulesButtons = [];
    const customModulesButtons = [];

    for (const module of modules) {
        if (module.name !== CONTACTS && module.name !== ACCOUNTS) {
            const moduleSectionType = drawerButtonArrangeHelper(module.name);

            switch (moduleSectionType) {
                case MARKETING:
                    //fillSection(marketModulesButtons, module, false);
                    break;
                case SALES:
                    fillSection(salesModulesButtons, module, false);
                    break;
                case INVENTORY:
                    //fillSection(inventoryModulesButtons, module, false);
                    break;
                case SUPPORT:
                    //fillSection(supportModulesButtons, module, false);
                    break;
                case PROJECT:
                    //fillSection(projectModulesButtons, module, false);
                    break;
                case TOOLS:
                    fillSection(toolsModulesButtons, module, false);
                    break;
                case CUSTOM:
                    // fillSection(customModulesButtons, module, true);
                    break;
                default:
                //fillSection(customModulesButtons, module, true);

            }
        }
    }

    marketingSectionContent.push(marketModulesButtons);
    salesSectionContent.push(salesModulesButtons);
    inventorySectionContent.push(inventoryModulesButtons);
    supportSectionContent.push(supportModulesButtons);
    projectSectionContent.push(projectModulesButtons);
    toolsSectionContent.push(toolsModulesButtons);
    customSectionContent.push(customModulesButtons);
};

const fillSection = (moduleButtons, module, custom) => {
    moduleButtons.push(getMenuHolder(module, custom));
};

const getMenuHolder = (module, custom) => <MenuHolder module={module} custom={custom} />;
const drawerButtonArrangeHelper = (name) => {
    switch (name) {
        // case ACCOUNTS:
        // case LEADS:
        // case CAMPAIGNS:
        // case CONTACTS:
        case CALENDAR:
        //     return MARKETING;
        //case QUOTES:
        case PRODUCTS:
        case INVOICE:
        case OPPORTUNITIES:
            //case SERVICES:
            //case SMS_NOTIFIER:
            return SALES;
        // case SALESORDER:
        // case VENDORS:
        // case PRICEBOOKS:
        // case PURCHASEORDER:
        //     return INVENTORY;
        // case TICKETS:
        // case FAQ:
        // case SERVICECONTRACTS:
        // case ASSETS:
        //     return SUPPORT;
        // case MODULE_PROJECT:
        // case PROJECT_TASK:
        // case PROJECT_MILESTONE:
        // case PBXMANAGER:
        //     return PROJECT;
        case DOCUMENTS:
        // case EMAILS:
        case REPORTS:
            return TOOLS;
        default:
        //return CUSTOM;
    }
};
