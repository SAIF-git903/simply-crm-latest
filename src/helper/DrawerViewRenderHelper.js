import React from 'react';
import { HOME, PROFILE, SETTINGS, LOGOUT, REBRAND, MARKETING, SALES, INVENTORY, 
SMACKCODERS_SUPPORT, SUPPORT, PROJECT, CUSTOM, CALENDAR, MARKETING_IMAGE, SALES_IMAGE, INVENTORY_IMAGE,
SUPPORT_IMAGE, PROJECT_IMAGE, CUSTOM_IMAGE,
DRAWER_COLUMN_TOTAL_HEIGHT, ACCOUNTS, LEADS, CAMPAIGNS, CONTACTS, QUOTES, PRODUCTS, 
SERVICES, ASSETS, SMS_NOTIFIER, OPPORTUNITIES, SALESORDER, 
INVOICE, VENDORS, PRICEBOOKS, PURCHASEORDER, TICKETS, 
FAQ, SERVICECONTRACTS, MODULE_PROJECT, PROJECT_TASK, PROJECT_MILESTONE,
PBXMANAGER } from '../variables/constants';
import ImageButton from '../components/drawer/components/imageButton';
import Menu from '../components/drawer/components/menu';
import Section from '../components/common/section';
import DrawerButton from '../components/drawer/components/drawerButton';
import SectionHolder from '../components/drawer/components/sectionHolder';
import EmptyDrawerButton from '../components/drawer/components/emptyDrawerButton';
import DrawerButtonColumn from '../components/drawer/components/drawerButtonColumn';
import { DRAWER_SECTION_BACKGROUND_COLOR, DRAWER_SECTION_HEADER_BACKGROUND_COLOR,
    DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR, DRAWER_SECTION_HEADER_IMAGE_COLOR,
    DRAWER_SECTION_HEADER_TEXT_COLOR } from '../variables/themeColors';


export const renderDrawerView = async (loginDetails, drawerInstance) => {
    const drawerViews = [];

    //.................................................................................

    const homeButton = <ImageButton type={HOME} />;
    const logoutButton = <ImageButton rootNavigation={drawerInstance.props.navigation} type={LOGOUT} />;
    const rebrandButton = <ImageButton type={REBRAND} />
    const supportButton = <ImageButton type={SMACKCODERS_SUPPORT} />

    const menuButtons = [homeButton, rebrandButton, supportButton, logoutButton];
    
    const menu = <Menu>{menuButtons}</Menu>;

    drawerViews.push(menu);

    //..................................................................................

    const marketSectionContent = [];
    const salesSectionContent = [];
    const inventorySectionContent = [];
    const supportSectionContent = [];
    const projectSectionContent = [];
    const customSectionContent = [];

    getSectionContent(marketSectionContent, salesSectionContent, inventorySectionContent, 
    supportSectionContent, projectSectionContent, customSectionContent, loginDetails.modules);

    const marketingSection = (<Section
    sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
    sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
    sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
    sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
    sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}  
    headerName={MARKETING} imageName={MARKETING_IMAGE}
    headerImage content={marketSectionContent} 
    contentHeight={marketSectionContent.length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);
    const salesSection = (<Section
    sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
    sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
    sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
    sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
    sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}  
    headerName={SALES} imageName={SALES_IMAGE}
    headerImage content={salesSectionContent} 
    contentHeight={salesSectionContent.length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);
    const inventorySection = (<Section 
    sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
    sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
    sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
    sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
    sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR} 
    headerName={INVENTORY} imageName={INVENTORY_IMAGE} 
    headerImage content={inventorySectionContent} 
    contentHeight={inventorySectionContent.length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);
    const supportSection = (<Section
    sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
    sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
    sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
    sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
    sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR} 
    headerName={SUPPORT} imageName={SUPPORT_IMAGE}
    headerImage content={supportSectionContent} 
    contentHeight={supportSectionContent.length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);
    const projectSection = (<Section 
    sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
    sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR} 
    sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
    sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
    sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR}
    headerName={PROJECT} imageName={PROJECT_IMAGE}
    headerImage content={projectSectionContent}
    contentHeight={projectSectionContent.length * DRAWER_COLUMN_TOTAL_HEIGHT} 
    />);
    const customSection = (<Section 
    sectionBackgroundColor={DRAWER_SECTION_BACKGROUND_COLOR}
    sectionHeaderBackground={DRAWER_SECTION_HEADER_BACKGROUND_COLOR}
    sectionHeaderTextColor={DRAWER_SECTION_HEADER_TEXT_COLOR}
    sectionHeaderImageColor={DRAWER_SECTION_HEADER_IMAGE_COLOR}
    sectionHeaderImageSelectedColor={DRAWER_SECTION_HEADER_IMAGE_SELECTED_COLOR} 
    headerName={CUSTOM} imageName={CUSTOM_IMAGE}
    headerImage content={customSectionContent} 
    contentHeight={customSectionContent.length * DRAWER_COLUMN_TOTAL_HEIGHT}
    />);

    const section = [];
    if (marketSectionContent.length > 0) {
        section.push(marketingSection);
    }

    if (salesSectionContent.length > 0) {
        section.push(salesSection);
    }

    if (inventorySectionContent.length > 0) {
        section.push(inventorySection);
    }

    if (supportSectionContent.length > 0) {
        section.push(supportSection);
    }

    if (projectSectionContent.length > 0) {
        section.push(projectSection);
    }

    if (customSectionContent.length > 0) {
        section.push(customSection);
    }

    const sectionHolder = <SectionHolder>{section}</SectionHolder>;

    drawerViews.push(sectionHolder);

    drawerInstance.setState({ drawerLoadComplete: true, loading: false, drawerViews });
};

const getSectionContent = (marketingSectionContent, salesSectionContent, inventorySectionContent,
supportSectionContent, projectSectionContent, customSectionContent, modules) => {
    const marketModulesButtons = [];
    const salesModulesButtons = [];
    const inventoryModulesButtons = [];
    const supportModulesButtons = [];
    const projectModulesButtons = [];
    const customModulesButtons = [];

    for (const module of modules) {
        const moduleSectionType = drawerButtonArrangeHelper(module.name);
        // if (module.name === 'Quotes' || module.name === 'PurchaseOrder' ||
        //     module.name === 'SalesOrder' || module.name === 'Invoice' || 
        //     module.name === 'PriceBooks' || ) {
        //     continue;
        // }
        switch (moduleSectionType) {
            case MARKETING:
                fillSection(marketModulesButtons, marketingSectionContent, module, false);
                break;
            case SALES:
                fillSection(salesModulesButtons, salesSectionContent, module, false);
                break;
            case INVENTORY:
                fillSection(inventoryModulesButtons, inventorySectionContent, module, false);
                break;
            case SUPPORT:
                fillSection(supportModulesButtons, supportSectionContent, module, false);
                break;
            case PROJECT:
                fillSection(projectModulesButtons, projectSectionContent, module, false);
                break;
            case CUSTOM:
                fillSection(customModulesButtons, customSectionContent, module, true);
                break;
            default:
                fillSection(customModulesButtons, customSectionContent, module, true);
        }
    }

    (marketModulesButtons.length > 0) ? 
    addEmptyButton(marketModulesButtons, marketingSectionContent) : undefined;
    (salesModulesButtons.length > 0) ? 
    addEmptyButton(salesModulesButtons, salesSectionContent) : undefined;
    (inventoryModulesButtons.length > 0) ? 
    addEmptyButton(inventoryModulesButtons, inventorySectionContent) : undefined;
    (supportModulesButtons.length > 0) ? 
    addEmptyButton(supportModulesButtons, supportSectionContent) : undefined;
    (projectModulesButtons.length > 0) ? 
    addEmptyButton(projectModulesButtons, projectSectionContent) : undefined;
    (customModulesButtons.length > 0) ? 
    addEmptyButton(customModulesButtons, customSectionContent) : undefined;
};

const fillSection = (moduleButtons, sectionContent, module, custom) => {
    if (moduleButtons.length < 3) {
        moduleButtons.push(getDrawerButton(module, custom));
    } else {
        const sectionContentArray = moduleButtons.slice();
        sectionContent.push(getDrawerButtonColumn(sectionContentArray));
        moduleButtons.splice(0, moduleButtons.length);
        moduleButtons.push(getDrawerButton(module, custom));
    }
};

const addEmptyButton = (moduleButtons, sectionContent) => {
    for (let i = moduleButtons.length; i < 3; i++) {
        moduleButtons.push(getEmptyButton());
    }
    const sectionContentArray = moduleButtons.slice();
    sectionContent.push(getDrawerButtonColumn(sectionContentArray));
    moduleButtons.splice(0, moduleButtons.length);
};

const getDrawerButton = (module, custom) => <DrawerButton custom={custom} module={module} />;

const getEmptyButton = () => <EmptyDrawerButton />;
const getDrawerButtonColumn = (moduleButtons) => 
<DrawerButtonColumn>{moduleButtons}</DrawerButtonColumn>;

const drawerButtonArrangeHelper = (name) => {
    switch (name) {
        case ACCOUNTS:
        case LEADS:
        case CAMPAIGNS:
        case CONTACTS:
        case CALENDAR:
            return MARKETING;
        case QUOTES:
        case PRODUCTS:
        case SERVICES:
        case SMS_NOTIFIER:
        case OPPORTUNITIES:
            return SALES;
        case SALESORDER:
        case INVOICE:
        case VENDORS:
        case PRICEBOOKS:
        case PURCHASEORDER:
            return INVENTORY;
        case TICKETS:
        case FAQ:
        case SERVICECONTRACTS:
        case ASSETS:
            return SUPPORT;
        case MODULE_PROJECT:
        case PROJECT_TASK:
        case PROJECT_MILESTONE:
        case PBXMANAGER:
            return PROJECT;
        default:
            return CUSTOM;
    }
};
