import React, { useEffect, useState } from 'react';
import {
  AmbassadorsPageMain,
  AmbassadorsPageCharts,
  AmbassadorsPageFilter,
  AmbassadorsPageFilterActions,
} from 'features/ambassadors/style';
import {
  CardWithChart,
  CardWithText,
  NewCheckboxTable,
} from 'components/custom';
import {
  ClientsAIcon,
  ContactIcon,
  DeleteIcon,
  EditIcon,
  FinishedIcon,
  RegisteredAmbassador,
  ScheduleIcon,
  SlidersHorizontalIcon,
  VerticalDotsIcon,
} from 'components/svg';
import { faker } from '@faker-js/faker';
import { Button, Input, InputGroup, Pagination } from 'components/ui';
import { Collapse, Grid, Stack } from 'components/system';
import { TTableRenderItemObject } from 'components/custom/table/types';
import {
  DAmbassadorsHead,
  DGenerateAmbassadorsFilter,
} from 'features/ambassadors/data';
import {
  useDebounce,
  useMenu,
  useModal,
  usePagination,
  useSnackbar,
} from 'hooks';
import {
  AmbassadorsProfile,
  ClientListAmbassadorModal,
  ContactAmbassadorsModal,
  DeleteAmbassadorsModal,
  InviteAmbassadors,
  NoteAmbassadors,
  ScheduleAmbassadorsModal,
  SingleAmbassadorActions,
} from 'features/ambassadors/role/admin/elements';
import {
  AmbassadorAPI,
  CompanyAPI,
  DiseaseAreaAPI,
  IndustryApi,
  InfluencerAPI,
  LocationAPI,
  ProductApi,
} from 'api';
import { BackupTableRounded } from '@mui/icons-material';
import PromptModal from 'features/discover-influencers/role/admin/elements/approve-influencer-modal';
import { IPagClient, IResult } from 'api/ambassador/types';
import { formatLongString } from 'utilities/string-converter';
import { Tooltip } from '@mui/material';
import { AmbassadorAction } from 'features/influencers/role/admin/styles';
import {
  ISpan,
  ToBeApprovedActionsMenu as CustomActionsMenu,
  TableTooltip,
  CardWrapper,
} from './style';

const getClientsAsCommaSeparatedString = (clients: IPagClient[]): string =>
  clients
    .map((client) => `${client.user.firstName} ${client.user.lastName}`)
    .join(', ');

interface ISelectedField {
  label: string;
  value: string;
}

interface IMinMaxField {
  min: string;
  max: string;
}

interface IFilterProps {
  search?: string;
  industry: ISelectedField[];
  company: ISelectedField[];
  role: ISelectedField[];
  product: ISelectedField[];
  diseaseArea: ISelectedField[];
  location: ISelectedField[];
  market: ISelectedField[];
  projectStatus: ISelectedField | null;
  // status: number | null;
  joinedFrom: Date | null;
  joinedTo: Date | null;
  project: ISelectedField | null;
  totalProjects: IMinMaxField;
  projectLast30Days: IMinMaxField;
  commission: IMinMaxField;
  totalClients: IMinMaxField;
}

const AdminAmbassadorsPage = () => {
  const initialFilters: IFilterProps = {
    search: '',
    industry: [],
    company: [],
    role: [],
    product: [],
    diseaseArea: [],
    location: [],
    market: [],
    projectStatus: null,
    joinedFrom: null,
    joinedTo: null,
    project: null,
    commission: {
      min: '',
      max: '',
    },
    totalProjects: {
      min: '',
      max: '',
    },
    projectLast30Days: {
      min: '',
      max: '',
    },
    totalClients: {
      min: '',
      max: '',
    },
  };
  const [filter, setFilter] = useState<IFilterProps>(initialFilters);

  const [filterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const [daModal, openDaModal, closeDaModal] = useModal(false);
  const [caModal, openCaModal, closeCaModal] = useModal(false);
  const [saModal, openSaModal, closeSaModal] = useModal(false);
  const [apModal, openApModal, closeApModal] = useModal(false);
  const [naModal, openNaModal, closeNaModal] = useModal(false);
  const [iaModal, openIaModal, closeIaModal] = useModal(false);
  const [claModal, openClaModal, closeClaModal] = useModal(false);

  const [ambassadors, setAmbassadors] = useState<any>([]);
  const [currentAmbassador, setCurrentAmbassador] = useState<number>();

  const getCurrentAmbassador = (value: any) => {
    setCurrentAmbassador(value);
  };
  const [checkedAmbassadors, setCheckedAmbassadors] = useState<number[]>([]);

  const [filterCleared, setFilterCleared] = useState(false);

  const { push } = useSnackbar();

  const getStateValueAsNumArray = (stateValue: ISelectedField[]): number[] =>
    stateValue && stateValue.length
      ? stateValue.map((item) => +item.value)
      : [];

  const { pagesCount, page, setTotalResults, handlePageChange, reload } =
    usePagination({
      limit: 10,
      page: 1,
      onChange: async (params, setPage) => {
        const formattedFilterParams = {
          search: filter.search,
          industryIds: filter.industry.length
            ? getStateValueAsNumArray(filter.industry)
            : undefined,
          companyIds: filter.company.length
            ? getStateValueAsNumArray(filter.company)
            : undefined,
          roleIds: filter.role.length
            ? getStateValueAsNumArray(filter.role)
            : undefined,
          productIds: filter.product.length
            ? getStateValueAsNumArray(filter.product)
            : undefined,

          diseaseAreaIds: filter.diseaseArea.length
            ? getStateValueAsNumArray(filter.diseaseArea)
            : undefined,
          // locationIds: filter.location ? [filter.location.value] : undefined,
          marketIds: filter.market.length
            ? getStateValueAsNumArray(filter.market)
            : undefined,
          locationIds: filter.location.length
            ? getStateValueAsNumArray(filter.location)
            : undefined,
          projectStatus: filter.projectStatus
            ? filter.projectStatus?.value
            : undefined,
          project: filter.project ? filter.project.value : undefined,
          commissionMin:
            filter.commission && filter.commission.min.length
              ? +filter.commission.min
              : undefined,
          commissionMax:
            filter.commission && filter.commission.max.length
              ? +filter.commission.max
              : undefined,
          clientsMin:
            filter.totalClients && filter.totalClients.min.length
              ? +filter.totalClients.min
              : undefined,
          clientsMax:
            filter.totalClients && filter.totalClients.max.length
              ? +filter.totalClients.max
              : undefined,
          totalProjectsMin:
            filter.totalProjects && filter.totalProjects.min.length
              ? +filter.totalProjects.min
              : undefined,
          totalProjectsMax:
            filter.totalProjects && filter.totalProjects.max.length
              ? +filter.totalProjects.max
              : undefined,
          projectsLast30DaysMin:
            filter.projectLast30Days && filter.projectLast30Days.min.length
              ? +filter.projectLast30Days.min
              : undefined,
          projectsLast30DaysMax:
            filter.projectLast30Days && filter.projectLast30Days.max.length
              ? +filter.projectLast30Days.max
              : undefined,
          joinedFrom: filter.joinedFrom || undefined,
          joinedTo: filter.joinedTo || undefined,
        };

        const { result, meta } = await AmbassadorAPI.getAmbassadors({
          limit: params.limit,
          skip: params.skip,
          ...formattedFilterParams,
        });

        setPage(params.page);

        setAmbassadors(result);
        setTotalResults(meta.countFiltered);
      },
    });

  const toggleAllCheckedAmassadors = (checked: boolean) => {
    if (checked) {
      const currentPageIds = ambassadors.map((row: any) => row.id);
      const newSelectedRows = Array.from(
        new Set([...checkedAmbassadors, ...currentPageIds])
      );
      setCheckedAmbassadors(newSelectedRows);
    } else {
      // Deselect all rows on the current page
      const currentPageIds = ambassadors.map((row: any) => row.id);
      const newSelectedRows = checkedAmbassadors.filter(
        (rowId) => !currentPageIds.includes(rowId)
      );
      setCheckedAmbassadors(newSelectedRows);
    }
  };

  const toggleAmbassador = (rowId: number, checked: boolean) => {
    if (checked) {
      setCheckedAmbassadors([...checkedAmbassadors, rowId]);
    } else {
      setCheckedAmbassadors(checkedAmbassadors.filter((id) => id !== rowId));
    }
  };

  const [products, setProducts] = useState<any>([]);
  const [diseaseAreas, setDiseaseAreas] = useState<any[]>([]);
  const [locations, setLocations] = useState<any>();
  const [markets, setMarkets] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [titles, setTitles] = useState<any[]>([]);

  const getProducts = async (s: string = '') => {
    const { result } = await ProductApi.getProducts(s);

    setProducts(
      result.map((data: any) => ({
        value: data.id,
        label: data.name,
      }))
    );
  };

  const getDiseaseAreas = async (s: string = '') => {
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseAreas(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const getLocations = async (s: string = '') => {
    const { result } = await LocationAPI.getAll(s);
    setLocations(
      result.map((data: any) => ({
        value: data.id,
        label: data.country ? `${data.name}, ${data.country.name}` : data.name,
      }))
    );
  };

  const getMarkets = async (s: string = '') => {
    const { result } = await LocationAPI.getAll(s);
    setMarkets(
      result.map((x: any) => ({
        value: x.id,
        label: x.country ? `${x.name}, ${x.country.name}` : x.name,
      }))
    );
  };

  const getIndustries = async (s: string = '') => {
    const { result } = await IndustryApi.getIndustries(s);

    setIndustries(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getCompanies = async (s: string = '') => {
    const { result } = await CompanyAPI.getAll(s);

    setCompanies(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getTitles = async (s: string = '') => {
    const { result } = await CompanyAPI.getAllTitles(s);

    setTitles(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const debouncedProducts = useDebounce(getProducts, 250);
  const debouncedDiseaseAreas = useDebounce(getDiseaseAreas, 250);
  const debouncedLocations = useDebounce(getLocations, 250);
  const debouncedMarkets = useDebounce(getMarkets, 250);
  const debouncedIndustries = useDebounce(getIndustries, 250);
  const debouncedCompanies = useDebounce(getCompanies, 250);
  const debouncedTitles = useDebounce(getTitles, 250);

  // Table New Checkbox Modal controlls
  const [tableModal, openTableModal, closeTableModal] = useModal(false);

  // Table Menu List Modal
  const [menu, open, setOpen, buttonRegRef, position] = useMenu(false);

  // placeholder items
  const [contactModal, openContactModal, closeContactModal] = useModal(false);
  const [noteModal, openNoteModal, closeNoteModal] = useModal(false);
  const [scheduleModal, openScheduleModal, closeScheduleModal] =
    useModal(false);

  const [
    removeBulkAmbassadorModal,
    openRemoveBulkAmbassadorModal,
    closeRemoveBulkAmbassadorModal,
  ] = useModal(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  const ambassadorBulkActions = [
    {
      icon: <ContactIcon />,
      label: 'Contact',
      action: () => {
        openContactModal();
        handleMenu();
      },
    },
    {
      icon: <EditIcon />,
      label: 'Note',
      action: () => {
        openNoteModal();
        handleMenu();
      },
    },
    {
      icon: <ScheduleIcon />,
      label: 'Schedule',
      action: () => {
        openScheduleModal();
        handleMenu();
      },
    },
    {
      icon: <BackupTableRounded />,
      label: 'Columns',
      action: () => {
        openTableModal();
        handleMenu();
      },
    },
    {
      icon: <DeleteIcon />,
      label: 'Remove',
      action: () => {
        openRemoveBulkAmbassadorModal();
        handleMenu();
      },
    },
  ];

  const renderItem = ({
    headItem,
    row,
    cell,
    table,
  }: TTableRenderItemObject) => {
    const rowData = row.data as IResult;
    if (headItem.reference === 'firstName') {
      return (
        <AmbassadorAction
          onClick={() => {
            getCurrentAmbassador(rowData.ambassador.userId);
            openApModal();
          }}
        >
          {rowData.firstName}
        </AmbassadorAction>
      );
    }
    if (headItem.reference === 'lastName') {
      return rowData.lastName;
    }
    if (headItem.reference === 'email') {
      return rowData.email;
    }
    if (headItem.reference === 'company') {
      return rowData.ambassador.company.name;
    }
    if (headItem.reference === 'role') {
      return rowData.ambassador.companyTitle.name;
    }
    if (headItem.reference === 'invited') {
      if (rowData.ambassador.clients) {
        const formattedDiseases = getClientsAsCommaSeparatedString(
          rowData.ambassador.clients
        );

        const formattedElipsisString = formatLongString(formattedDiseases, 50);
        return (
          <Tooltip
            style={{ cursor: 'pointer' }}
            title={<TableTooltip>{formattedDiseases}</TableTooltip>}
          >
            <span>{formattedElipsisString}</span>
          </Tooltip>
        );
      }
    }
    if (headItem.reference === 'invitedCount') {
      return rowData.ambassador.clients
        ? rowData.ambassador.clients.length
        : '0';
    }
    if (headItem.reference === 'location') {
      if (!rowData.ambassador.user.location) {
        return '';
      }
      const { location } = rowData.ambassador.user;
      const label = location.country
        ? `${location.name}, ${location.country.name}`
        : location.name;

      return label;
    }
    if (headItem.reference === 'actions') {
      return <SingleAmbassadorActions data={rowData} reload={reload} />;
    }

    return '';
  };

  const handleBulkAmbassadorRemoval = async () => {
    try {
      await InfluencerAPI.deleteManyInfluencers({
        userIds: checkedAmbassadors,
      });
      reload();
      setCheckedAmbassadors([]);

      push('Ambassadors successfully removed!', { variant: 'success' });
    } catch (e: any) {
      push(e.response.data.message, { variant: 'error' });
    }
  };

  const handleFilter = async () => {
    // This will reload the data aswell and avoid double calls
    handlePageChange(1);
  };

  const clearFilters = () => {
    setFilter(initialFilters);
    setFilterCleared(true);
  };

  useEffect(() => {
    getProducts();
    getDiseaseAreas();
    getLocations();
    getMarkets();
    getIndustries();
    getCompanies();
    getTitles();
  }, []);

  useEffect(() => {
    if (filterCleared) {
      setFilterCleared(false);
      handlePageChange(1);
    }
  }, [filter, filterCleared]);

  return (
    <AmbassadorsPageMain>
      <AmbassadorsPageCharts>
        <CardWrapper>
          <CardWithChart
            title="Registered"
            icon={<RegisteredAmbassador />}
            percent={0}
            count={0}
            chartData={{
              values: Array.from(Array(20).keys()).map((_x) =>
                faker.datatype.number({ min: 0, max: 0 })
              ),
              labels: Array.from(Array(20).keys()).map((_x) => ''),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Approved"
            icon={<FinishedIcon />}
            percent={0}
            count={0}
            chartData={{
              values: Array.from(Array(20).keys()).map((_x) =>
                faker.datatype.number({ min: 0, max: 0 })
              ),
              labels: Array.from(Array(20).keys()).map((_x) => ''),
            }}
          />
        </CardWrapper>
        <CardWrapper>
          <CardWithChart
            title="Clients"
            icon={<ClientsAIcon />}
            percent={0}
            count={0}
            chartData={{
              values: Array.from(Array(20).keys()).map((_x) =>
                faker.datatype.number({ min: 0, max: 0 })
              ),
              labels: Array.from(Array(20).keys()).map((_x) => ''),
            }}
          />
        </CardWrapper>
      </AmbassadorsPageCharts>
      <CardWithText
        title="Ambassadors"
        actions={[
          <Button
            color={filterOpen ? 'secondary' : 'default'}
            variant="contained"
            onClick={toggleFilter}
            startIcon={<SlidersHorizontalIcon width="18" height="18" />}
          >
            Filters
          </Button>,
          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={openIaModal}
          >
            Invite
          </Button>,
        ]}
      >
        <Stack>
          <Collapse in={filterOpen}>
            <AmbassadorsPageFilter>
              <Grid columns={4}>
                <Input
                  type="text"
                  label="Search"
                  placeholder="Please Enter"
                  value={filter.search}
                  onValue={(search) => setFilter({ ...filter, search })}
                />
                <Input
                  type="multiselect"
                  label="Industry"
                  placeholder="Please Select"
                  value={filter.industry}
                  onValue={(industry) => setFilter({ ...filter, industry })}
                  options={industries}
                  onSearch={debouncedIndustries}
                />
                <Input
                  type="multiselect"
                  label="Company"
                  placeholder="Please Select"
                  value={filter.company}
                  onValue={(company) => setFilter({ ...filter, company })}
                  options={companies}
                  onSearch={debouncedCompanies}
                />
                <Input
                  type="multiselect"
                  label="Role"
                  placeholder="Please Select"
                  value={filter.role}
                  onValue={(role) => setFilter({ ...filter, role })}
                  options={titles}
                  onSearch={debouncedTitles}
                />
                <Input
                  type="multiselect"
                  label="Product"
                  placeholder="Please Select"
                  value={filter.product}
                  onValue={(product) => setFilter({ ...filter, product })}
                  options={products}
                  onSearch={debouncedProducts}
                />
                <Input
                  type="multiselect"
                  label="Disease Area"
                  placeholder="Please Select"
                  value={filter.diseaseArea}
                  onValue={(diseaseArea) =>
                    setFilter({ ...filter, diseaseArea })
                  }
                  options={diseaseAreas}
                  onSearch={debouncedDiseaseAreas}
                />
                <Input
                  type="multiselect"
                  label="Location"
                  placeholder="Please Select"
                  value={filter.location}
                  onValue={(location) => setFilter({ ...filter, location })}
                  options={locations}
                  onSearch={debouncedLocations}
                />
                <Input
                  type="multiselect"
                  label="Market"
                  placeholder="Please Select"
                  value={filter.market}
                  onValue={(market) => setFilter({ ...filter, market })}
                  options={markets}
                  onSearch={debouncedMarkets}
                />
                <Input
                  type="select"
                  label="Project Status"
                  placeholder="Please Select"
                  value={filter.projectStatus}
                  onValue={(projectStatus) =>
                    setFilter({ ...filter, projectStatus })
                  }
                  options={[
                    {
                      value: 0,
                      label: 'In Preparation',
                    },
                    {
                      value: 1,
                      label: 'Ongoing',
                    },
                    {
                      value: 2,
                      label: 'Finished',
                    },
                  ]}
                />
                <InputGroup
                  label="Date Joined"
                  inputRatio="1fr 1fr"
                  elements={[
                    {
                      value: filter.joinedFrom,
                      onValue: (joinedFrom) =>
                        setFilter({ ...filter, joinedFrom }),
                      type: 'date',
                      placeholder: 'From',
                    },
                    {
                      value: filter.joinedTo,
                      onValue: (joinedTo) => setFilter({ ...filter, joinedTo }),
                      type: 'date',
                      placeholder: 'To',
                    },
                  ]}
                />

                <Input
                  type="select"
                  label="Project"
                  placeholder="Please Select"
                  value={filter.project}
                  onValue={(project) => setFilter({ ...filter, project })}
                  options={[
                    {
                      value: 1,
                      label: 'Campaign',
                    },
                    {
                      value: 2,
                      label: 'Survey',
                    },
                  ]}
                />
                <Input
                  type="min-max"
                  label="Commission"
                  value={filter.commission}
                  onValue={(commission) => setFilter({ ...filter, commission })}
                />
                <Input
                  type="min-max"
                  label="Total Project"
                  value={filter.totalProjects}
                  onValue={(totalProjects) =>
                    setFilter({ ...filter, totalProjects })
                  }
                />
                <Input
                  type="min-max"
                  label="Project Last 30 Days"
                  value={filter.projectLast30Days}
                  onValue={(projectLast30Days) =>
                    setFilter({ ...filter, projectLast30Days })
                  }
                />
                <Input
                  type="min-max"
                  label="Total Clients"
                  placeholder="Please Select"
                  value={filter.totalClients}
                  onValue={(totalClients) =>
                    setFilter({ ...filter, totalClients })
                  }
                />
              </Grid>
              <AmbassadorsPageFilterActions direction="horizontal">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => handleFilter()}
                >
                  Filter
                </Button>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={clearFilters}
                >
                  Clear filter
                </Button>
              </AmbassadorsPageFilterActions>
            </AmbassadorsPageFilter>
          </Collapse>
          <>
            <NewCheckboxTable
              head={DAmbassadorsHead}
              items={ambassadors}
              renderItem={renderItem}
              checkedRows={checkedAmbassadors}
              onSingleSelect={toggleAmbassador}
              onSelectAll={toggleAllCheckedAmassadors}
              tableColModal={tableModal}
              closeTableColModal={closeTableModal}
              renderElements={
                <>
                  <ISpan onClick={handleMenu} ref={buttonRegRef}>
                    <VerticalDotsIcon />
                  </ISpan>
                  {open && (
                    <CustomActionsMenu
                      position={position}
                      items={ambassadorBulkActions}
                      ref={menu}
                    />
                  )}
                </>
              }
            />
            <Pagination
              style={{ justifyContent: 'right' }}
              onChange={(_e, x) => handlePageChange(x)}
              page={page}
              count={pagesCount}
            />
          </>

          <Stack direction="horizontal">
            {/* Client list example modal for future feature */}
            {/* <Button color="primary" variant="contained" onClick={openClaModal}>
              Client List
            </Button> */}
          </Stack>
        </Stack>
      </CardWithText>
      {daModal && <DeleteAmbassadorsModal onClose={closeDaModal} />}
      {caModal && <ContactAmbassadorsModal onClose={closeCaModal} />}
      {saModal && <ScheduleAmbassadorsModal onClose={closeSaModal} />}
      {apModal && (
        <AmbassadorsProfile
          ambassadorId={currentAmbassador!}
          onClose={closeApModal}
        />
      )}
      {naModal && <NoteAmbassadors onClose={closeNaModal} />}
      {iaModal && <InviteAmbassadors onClose={closeIaModal} />}
      {claModal && <ClientListAmbassadorModal onClose={closeClaModal} />}
      {removeBulkAmbassadorModal && (
        <PromptModal
          plural
          target="ambassador"
          onClose={() => {
            closeRemoveBulkAmbassadorModal();
          }}
          handleAction={handleBulkAmbassadorRemoval}
        />
      )}
    </AmbassadorsPageMain>
  );
};

export default AdminAmbassadorsPage;
