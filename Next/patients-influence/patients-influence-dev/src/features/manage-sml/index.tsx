import React, { useState } from 'react';
import {
  ManageSMLMain,
  ManageSMLPageFilter,
  ManageSMLFilterActions,
} from 'features/manage-sml/styles';
import { DGenerateManageSMLFilter } from 'features/manage-sml/data';
import { Button, Card, Input, InputGroup, Pagination } from 'components/ui';
import { CardWithText, Chat, Table, Tabs } from 'components/custom';
import { Collapse, Grid, GridCell, Stack } from 'components/system';
import { SlidersHorizontalIcon } from 'components/svg';
import { SMLInfo } from 'features/manage-sml/elements';
import { useModal } from 'hooks';
import { InputLabel } from 'components/ui/input/styles';
import { BarChart, ExtendedLineChart, PieChart } from 'components/csr';
import Theme from 'theme';

const ManageSMLPage = ({ ...props }) => {
  const [tabs, setTabs] = useState(0);

  const [filterTabs, setFilterTabs] = useState(0);

  const [filter, setFilter] = useState<any>(DGenerateManageSMLFilter());
  const [filterOpen, setFilterOpen] = useState(false);

  const [siModal, openSiModal, closeSiModal] = useModal(false);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateManageSMLFilter());
  };

  return (
    <ManageSMLMain {...props}>
      <Tabs
        tabs={[
          'Posts',
          'Overview',
          'Brands & Products',
          'Symptoms & Struggles',
          'Demographics',
          'AI Consultant',
        ]}
        value={tabs}
        onValue={setTabs}
      />

      {tabs === 0 && (
        <>
          <CardWithText
            title="Posts"
            description="More than 30.7k posts"
            actions={[
              <Button
                color={filterOpen ? 'secondary' : 'default'}
                variant="contained"
                onClick={toggleFilter}
                startIcon={<SlidersHorizontalIcon width="18" height="18" />}
              >
                Filters
              </Button>,
            ]}
          >
            <Collapse in={filterOpen}>
              <ManageSMLPageFilter>
                <Tabs
                  tabs={['Author', 'Post']}
                  value={filterTabs}
                  onValue={setFilterTabs}
                />
                {filterTabs === 0 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Stakeholder"
                      placeholder="Please Select"
                      value={filter.stakeholder}
                      onValue={(stakeholder) =>
                        setFilter({ ...filter, stakeholder })
                      }
                    />
                    <Input
                      type="select"
                      label="Gender"
                      placeholder="Please Select"
                      value={filter.gender}
                      onValue={(gender) => setFilter({ ...filter, gender })}
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="select"
                      label="Disease Area"
                      placeholder="Please Select"
                      value={filter.diseaseArea}
                      onValue={(diseaseArea) =>
                        setFilter({ ...filter, diseaseArea })
                      }
                    />
                    <Input
                      type="select"
                      label="Location"
                      placeholder="Please Select"
                      value={filter.location}
                      onValue={(location) => setFilter({ ...filter, location })}
                    />
                    <Input
                      type="select"
                      label="Ethnicity"
                      placeholder="Please Select"
                      value={filter.ethnicity}
                      onValue={(ethnicity) =>
                        setFilter({ ...filter, ethnicity })
                      }
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="min-max"
                      label="Age"
                      value={filter.age}
                      onValue={(age) => setFilter({ ...filter, age })}
                    />
                    <Input
                      type="select"
                      label="Struggles"
                      placeholder="Please Select"
                      value={filter.struggles}
                      onValue={(struggles) =>
                        setFilter({ ...filter, struggles })
                      }
                    />
                    <Input
                      type="select"
                      label="Symptoms"
                      placeholder="Please Select"
                      value={filter.symptoms}
                      onValue={(symptoms) => setFilter({ ...filter, symptoms })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Please Select"
                      value={filter.interests}
                      onValue={(interests) =>
                        setFilter({ ...filter, interests })
                      }
                    />
                    <Input
                      type="text"
                      label="Bio"
                      placeholder="Please Enter"
                      value={filter.bio}
                      onValue={(bio) => setFilter({ ...filter, bio })}
                    />
                  </Grid>
                )}
                {filterTabs === 1 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Social Media"
                      placeholder="Select Select"
                      value={filter.socialMedia}
                      onValue={(socialMedia) =>
                        setFilter({ ...filter, socialMedia })
                      }
                    />
                    <Input
                      type="select"
                      label="Theme"
                      placeholder="Select Select"
                      value={filter.theme}
                      onValue={(theme) => setFilter({ ...filter, theme })}
                    />
                    <Input
                      type="select"
                      label="Disease Area (HCP)"
                      placeholder="Select Select"
                      value={filter.diseaseAreaBA}
                      onValue={(diseaseAreaBA) =>
                        setFilter({ ...filter, diseaseAreaBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Struggle"
                      placeholder="Select Select"
                      value={filter.struggle}
                      onValue={(struggle) => setFilter({ ...filter, struggle })}
                    />
                    <Input
                      type="select"
                      label="Symptom"
                      placeholder="Select Select"
                      value={filter.symptom}
                      onValue={(symptom) => setFilter({ ...filter, symptom })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Select Select"
                      value={filter.interestBA}
                      onValue={(interestBA) =>
                        setFilter({ ...filter, interestBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Sentiment"
                      placeholder="Select Select"
                      value={filter.sentiment}
                      onValue={(sentiment) =>
                        setFilter({ ...filter, sentiment })
                      }
                    />
                    <Input
                      type="select"
                      label="Language"
                      placeholder="Select Select"
                      value={filter.language}
                      onValue={(language) => setFilter({ ...filter, language })}
                    />
                    <Input
                      type="select"
                      label="Brand"
                      placeholder="Select Select"
                      value={filter.brand}
                      onValue={(brand) => setFilter({ ...filter, brand })}
                    />
                    <Input
                      type="select"
                      label="Product"
                      placeholder="Select Select"
                      value={filter.product}
                      onValue={(product) => setFilter({ ...filter, product })}
                    />
                    <Input
                      type="min-max"
                      label="Likes"
                      value={filter.likes}
                      onValue={(likes) => setFilter({ ...filter, likes })}
                    />
                    <Input
                      type="min-max"
                      label="Comments"
                      value={filter.comments}
                      onValue={(comments) => setFilter({ ...filter, comments })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.startDate,
                          onValue: (startDate) =>
                            setFilter({ ...filter, startDate }),
                          type: 'date',
                          placeholder: 'From',
                        },
                        {
                          value: filter.endDate,
                          onValue: (endDate) =>
                            setFilter({ ...filter, endDate }),
                          type: 'date',
                          placeholder: 'To',
                        },
                      ]}
                    />
                    <Input
                      type="text"
                      label="Keyword"
                      placeholder="Select Enter"
                      value={filter.keyword}
                      onValue={(keyword) => setFilter({ ...filter, keyword })}
                    />
                  </Grid>
                )}
                <ManageSMLFilterActions direction="horizontal">
                  <Button color="primary" variant="contained">
                    Filter
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear filter
                  </Button>
                </ManageSMLFilterActions>
              </ManageSMLPageFilter>
            </Collapse>
          </CardWithText>
          <Card>
            <Grid columns={1}>
              <Stack>
                <Table
                  head={[
                    {
                      reference: 'post',
                      label: 'Post',
                      visible: true,
                    },
                    {
                      reference: 'likes',
                      label: 'Likes',
                      visible: true,
                    },
                    {
                      reference: 'comments',
                      label: 'Comments',
                      visible: true,
                    },
                  ]}
                  items={[]}
                  renderItem={() => {}}
                />
                <Pagination count={32} />
              </Stack>
            </Grid>
          </Card>
        </>
      )}
      {tabs === 1 && (
        <>
          <CardWithText
            title="Overview"
            description="More than 30.7k posts"
            actions={[
              <Button
                color={filterOpen ? 'secondary' : 'default'}
                variant="contained"
                onClick={toggleFilter}
                startIcon={<SlidersHorizontalIcon width="18" height="18" />}
              >
                Filters
              </Button>,
            ]}
          >
            <Collapse in={filterOpen}>
              <ManageSMLPageFilter>
                <Tabs
                  tabs={['Author', 'Post']}
                  value={filterTabs}
                  onValue={setFilterTabs}
                />
                {filterTabs === 0 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Stakeholder"
                      placeholder="Please Select"
                      value={filter.stakeholder}
                      onValue={(stakeholder) =>
                        setFilter({ ...filter, stakeholder })
                      }
                    />
                    <Input
                      type="select"
                      label="Gender"
                      placeholder="Please Select"
                      value={filter.gender}
                      onValue={(gender) => setFilter({ ...filter, gender })}
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="select"
                      label="Disease Area"
                      placeholder="Please Select"
                      value={filter.diseaseArea}
                      onValue={(diseaseArea) =>
                        setFilter({ ...filter, diseaseArea })
                      }
                    />
                    <Input
                      type="select"
                      label="Location"
                      placeholder="Please Select"
                      value={filter.location}
                      onValue={(location) => setFilter({ ...filter, location })}
                    />
                    <Input
                      type="select"
                      label="Ethnicity"
                      placeholder="Please Select"
                      value={filter.ethnicity}
                      onValue={(ethnicity) =>
                        setFilter({ ...filter, ethnicity })
                      }
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="min-max"
                      label="Age"
                      value={filter.age}
                      onValue={(age) => setFilter({ ...filter, age })}
                    />
                    <Input
                      type="select"
                      label="Struggles"
                      placeholder="Please Select"
                      value={filter.struggles}
                      onValue={(struggles) =>
                        setFilter({ ...filter, struggles })
                      }
                    />
                    <Input
                      type="select"
                      label="Symptoms"
                      placeholder="Please Select"
                      value={filter.symptoms}
                      onValue={(symptoms) => setFilter({ ...filter, symptoms })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Please Select"
                      value={filter.interests}
                      onValue={(interests) =>
                        setFilter({ ...filter, interests })
                      }
                    />
                    <Input
                      type="text"
                      label="Bio"
                      placeholder="Please Enter"
                      value={filter.bio}
                      onValue={(bio) => setFilter({ ...filter, bio })}
                    />
                  </Grid>
                )}
                {filterTabs === 1 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Social Media"
                      placeholder="Select Select"
                      value={filter.socialMedia}
                      onValue={(socialMedia) =>
                        setFilter({ ...filter, socialMedia })
                      }
                    />
                    <Input
                      type="select"
                      label="Theme"
                      placeholder="Select Select"
                      value={filter.theme}
                      onValue={(theme) => setFilter({ ...filter, theme })}
                    />
                    <Input
                      type="select"
                      label="Disease Area (HCP)"
                      placeholder="Select Select"
                      value={filter.diseaseAreaBA}
                      onValue={(diseaseAreaBA) =>
                        setFilter({ ...filter, diseaseAreaBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Struggle"
                      placeholder="Select Select"
                      value={filter.struggle}
                      onValue={(struggle) => setFilter({ ...filter, struggle })}
                    />
                    <Input
                      type="select"
                      label="Symptom"
                      placeholder="Select Select"
                      value={filter.symptom}
                      onValue={(symptom) => setFilter({ ...filter, symptom })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Select Select"
                      value={filter.interestBA}
                      onValue={(interestBA) =>
                        setFilter({ ...filter, interestBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Sentiment"
                      placeholder="Select Select"
                      value={filter.sentiment}
                      onValue={(sentiment) =>
                        setFilter({ ...filter, sentiment })
                      }
                    />
                    <Input
                      type="select"
                      label="Language"
                      placeholder="Select Select"
                      value={filter.language}
                      onValue={(language) => setFilter({ ...filter, language })}
                    />
                    <Input
                      type="select"
                      label="Brand"
                      placeholder="Select Select"
                      value={filter.brand}
                      onValue={(brand) => setFilter({ ...filter, brand })}
                    />
                    <Input
                      type="select"
                      label="Product"
                      placeholder="Select Select"
                      value={filter.product}
                      onValue={(product) => setFilter({ ...filter, product })}
                    />
                    <Input
                      type="min-max"
                      label="Likes"
                      value={filter.likes}
                      onValue={(likes) => setFilter({ ...filter, likes })}
                    />
                    <Input
                      type="min-max"
                      label="Comments"
                      value={filter.comments}
                      onValue={(comments) => setFilter({ ...filter, comments })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.startDate,
                          onValue: (startDate) =>
                            setFilter({ ...filter, startDate }),
                          type: 'date',
                          placeholder: 'From',
                        },
                        {
                          value: filter.endDate,
                          onValue: (endDate) =>
                            setFilter({ ...filter, endDate }),
                          type: 'date',
                          placeholder: 'To',
                        },
                      ]}
                    />
                    <Input
                      type="text"
                      label="Keyword"
                      placeholder="Select Enter"
                      value={filter.keyword}
                      onValue={(keyword) => setFilter({ ...filter, keyword })}
                    />
                  </Grid>
                )}
                <ManageSMLFilterActions direction="horizontal">
                  <Button color="primary" variant="contained">
                    Filter
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear filter
                  </Button>
                </ManageSMLFilterActions>
              </ManageSMLPageFilter>
            </Collapse>
          </CardWithText>
          <Card>
            <Grid columns={2}>
              <Stack>
                <InputLabel>Most Mentioned Words</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      'Symptom',
                      'Doctor',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Timeline of Most Mentioned Words</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <ExtendedLineChart
                    labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                    data={[5, 30, 10, 40, 15]}
                  />
                </div>
                <Pagination count={3} />
              </Stack>
              <Stack>
                <InputLabel>Most Used Hashtags</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Used Emojis</InputLabel>
                <img alt="text" src="/static/assets/images/Emojimap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Sentiment Analysis</InputLabel>
                <PieChart
                  labels={['Positive', 'Negative', 'Neutral']}
                  data={[52, 23, 14]}
                />
              </Stack>
              <Stack>
                <Table
                  head={[
                    {
                      reference: 'phrase',
                      label: 'Phrase',
                      visible: true,
                    },
                    {
                      reference: 'volume',
                      label: 'Volume',
                      visible: true,
                    },
                    {
                      reference: 'sentiment',
                      label: 'Sentiment',
                      visible: true,
                    },
                  ]}
                  items={[]}
                  renderItem={() => {}}
                />
                <Pagination count={3} />
              </Stack>
            </Grid>
          </Card>
        </>
      )}
      {tabs === 2 && (
        <>
          <CardWithText
            title="Brand & Products"
            description="More than 30.7k posts"
            actions={[
              <Button
                color={filterOpen ? 'secondary' : 'default'}
                variant="contained"
                onClick={toggleFilter}
                startIcon={<SlidersHorizontalIcon width="18" height="18" />}
              >
                Filters
              </Button>,
            ]}
          >
            <Collapse in={filterOpen}>
              <ManageSMLPageFilter>
                <Tabs
                  tabs={['Author', 'Post']}
                  value={filterTabs}
                  onValue={setFilterTabs}
                />
                {filterTabs === 0 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Stakeholder"
                      placeholder="Please Select"
                      value={filter.stakeholder}
                      onValue={(stakeholder) =>
                        setFilter({ ...filter, stakeholder })
                      }
                    />
                    <Input
                      type="select"
                      label="Gender"
                      placeholder="Please Select"
                      value={filter.gender}
                      onValue={(gender) => setFilter({ ...filter, gender })}
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="select"
                      label="Disease Area"
                      placeholder="Please Select"
                      value={filter.diseaseArea}
                      onValue={(diseaseArea) =>
                        setFilter({ ...filter, diseaseArea })
                      }
                    />
                    <Input
                      type="select"
                      label="Location"
                      placeholder="Please Select"
                      value={filter.location}
                      onValue={(location) => setFilter({ ...filter, location })}
                    />
                    <Input
                      type="select"
                      label="Ethnicity"
                      placeholder="Please Select"
                      value={filter.ethnicity}
                      onValue={(ethnicity) =>
                        setFilter({ ...filter, ethnicity })
                      }
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="min-max"
                      label="Age"
                      value={filter.age}
                      onValue={(age) => setFilter({ ...filter, age })}
                    />
                    <Input
                      type="select"
                      label="Struggles"
                      placeholder="Please Select"
                      value={filter.struggles}
                      onValue={(struggles) =>
                        setFilter({ ...filter, struggles })
                      }
                    />
                    <Input
                      type="select"
                      label="Symptoms"
                      placeholder="Please Select"
                      value={filter.symptoms}
                      onValue={(symptoms) => setFilter({ ...filter, symptoms })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Please Select"
                      value={filter.interests}
                      onValue={(interests) =>
                        setFilter({ ...filter, interests })
                      }
                    />
                    <Input
                      type="text"
                      label="Bio"
                      placeholder="Please Enter"
                      value={filter.bio}
                      onValue={(bio) => setFilter({ ...filter, bio })}
                    />
                  </Grid>
                )}
                {filterTabs === 1 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Social Media"
                      placeholder="Select Select"
                      value={filter.socialMedia}
                      onValue={(socialMedia) =>
                        setFilter({ ...filter, socialMedia })
                      }
                    />
                    <Input
                      type="select"
                      label="Theme"
                      placeholder="Select Select"
                      value={filter.theme}
                      onValue={(theme) => setFilter({ ...filter, theme })}
                    />
                    <Input
                      type="select"
                      label="Disease Area (HCP)"
                      placeholder="Select Select"
                      value={filter.diseaseAreaBA}
                      onValue={(diseaseAreaBA) =>
                        setFilter({ ...filter, diseaseAreaBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Struggle"
                      placeholder="Select Select"
                      value={filter.struggle}
                      onValue={(struggle) => setFilter({ ...filter, struggle })}
                    />
                    <Input
                      type="select"
                      label="Symptom"
                      placeholder="Select Select"
                      value={filter.symptom}
                      onValue={(symptom) => setFilter({ ...filter, symptom })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Select Select"
                      value={filter.interestBA}
                      onValue={(interestBA) =>
                        setFilter({ ...filter, interestBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Sentiment"
                      placeholder="Select Select"
                      value={filter.sentiment}
                      onValue={(sentiment) =>
                        setFilter({ ...filter, sentiment })
                      }
                    />
                    <Input
                      type="select"
                      label="Language"
                      placeholder="Select Select"
                      value={filter.language}
                      onValue={(language) => setFilter({ ...filter, language })}
                    />
                    <Input
                      type="select"
                      label="Brand"
                      placeholder="Select Select"
                      value={filter.brand}
                      onValue={(brand) => setFilter({ ...filter, brand })}
                    />
                    <Input
                      type="select"
                      label="Product"
                      placeholder="Select Select"
                      value={filter.product}
                      onValue={(product) => setFilter({ ...filter, product })}
                    />
                    <Input
                      type="min-max"
                      label="Likes"
                      value={filter.likes}
                      onValue={(likes) => setFilter({ ...filter, likes })}
                    />
                    <Input
                      type="min-max"
                      label="Comments"
                      value={filter.comments}
                      onValue={(comments) => setFilter({ ...filter, comments })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.startDate,
                          onValue: (startDate) =>
                            setFilter({ ...filter, startDate }),
                          type: 'date',
                          placeholder: 'From',
                        },
                        {
                          value: filter.endDate,
                          onValue: (endDate) =>
                            setFilter({ ...filter, endDate }),
                          type: 'date',
                          placeholder: 'To',
                        },
                      ]}
                    />
                    <Input
                      type="text"
                      label="Keyword"
                      placeholder="Select Enter"
                      value={filter.keyword}
                      onValue={(keyword) => setFilter({ ...filter, keyword })}
                    />
                  </Grid>
                )}
                <ManageSMLFilterActions direction="horizontal">
                  <Button color="primary" variant="contained">
                    Filter
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear filter
                  </Button>
                </ManageSMLFilterActions>
              </ManageSMLPageFilter>
            </Collapse>
          </CardWithText>
          <Card>
            <Grid columns={2}>
              <Stack>
                <InputLabel>Most Mentioned Brands</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
                <Pagination count={3} />
              </Stack>
              <Stack>
                <InputLabel>Most Mentioned Products</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
                <Pagination count={3} />
              </Stack>
              <Stack>
                <InputLabel>Timeline of Most Mentioned Brands</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <ExtendedLineChart
                    labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                    data={[5, 30, 10, 40, 15]}
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Timeline of Most Mentioned Products</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <ExtendedLineChart
                    labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                    data={[5, 30, 10, 40, 15]}
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Sentiment Analysis - Brands</InputLabel>
                <PieChart
                  style={{ width: '50%' }}
                  labels={['Positive', 'Negative', 'Neutral']}
                  data={[52, 23, 14]}
                />
              </Stack>
              <Stack>
                <InputLabel>Sentiment Analysis - Products</InputLabel>
                <PieChart
                  style={{ width: '50%' }}
                  labels={['Positive', 'Negative', 'Neutral']}
                  data={[52, 23, 14]}
                />
              </Stack>
              <Stack>
                <InputLabel>Most Used Words with Brands</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Used Words with Products</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Used Hashtags with Brands</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Used Hashtags with Products</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most used Emojis with Brands</InputLabel>
                <img alt="text" src="/static/assets/images/Emojimap.jpg" />
              </Stack>

              <Stack>
                <InputLabel>Most used Emojis with Products</InputLabel>
                <img alt="text" src="/static/assets/images/Emojimap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Mentioned Phrases - Brand</InputLabel>
                <Table
                  head={[
                    {
                      reference: 'phrase',
                      label: 'Phrase',
                      visible: true,
                    },
                    {
                      reference: 'volume',
                      label: 'Volume',
                      visible: true,
                    },
                    {
                      reference: 'sentiment',
                      label: 'Sentiment',
                      visible: true,
                    },
                  ]}
                  items={[]}
                  renderItem={() => {}}
                />
                <Pagination count={3} />
              </Stack>

              <Stack>
                <InputLabel>Most Mentioned Phrases - Product</InputLabel>
                <Table
                  head={[
                    {
                      reference: 'phrase',
                      label: 'Phrase',
                      visible: true,
                    },
                    {
                      reference: 'volume',
                      label: 'Volume',
                      visible: true,
                    },
                    {
                      reference: 'sentiment',
                      label: 'Sentiment',
                      visible: true,
                    },
                  ]}
                  items={[]}
                  renderItem={() => {}}
                />
                <Pagination count={3} />
              </Stack>
            </Grid>
          </Card>
        </>
      )}
      {tabs === 3 && (
        <>
          <CardWithText
            title="Symptoms & Struggles"
            description="More than 30.7k likes"
            actions={[
              <Button
                color={filterOpen ? 'secondary' : 'default'}
                variant="contained"
                onClick={toggleFilter}
                startIcon={<SlidersHorizontalIcon width="18" height="18" />}
              >
                Filters
              </Button>,
            ]}
          >
            <Collapse in={filterOpen}>
              <ManageSMLPageFilter>
                <Tabs
                  tabs={['Author', 'Post']}
                  value={filterTabs}
                  onValue={setFilterTabs}
                />
                {filterTabs === 0 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Stakeholder"
                      placeholder="Please Select"
                      value={filter.stakeholder}
                      onValue={(stakeholder) =>
                        setFilter({ ...filter, stakeholder })
                      }
                    />
                    <Input
                      type="select"
                      label="Gender"
                      placeholder="Please Select"
                      value={filter.gender}
                      onValue={(gender) => setFilter({ ...filter, gender })}
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="select"
                      label="Disease Area"
                      placeholder="Please Select"
                      value={filter.diseaseArea}
                      onValue={(diseaseArea) =>
                        setFilter({ ...filter, diseaseArea })
                      }
                    />
                    <Input
                      type="select"
                      label="Location"
                      placeholder="Please Select"
                      value={filter.location}
                      onValue={(location) => setFilter({ ...filter, location })}
                    />
                    <Input
                      type="select"
                      label="Ethnicity"
                      placeholder="Please Select"
                      value={filter.ethnicity}
                      onValue={(ethnicity) =>
                        setFilter({ ...filter, ethnicity })
                      }
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="min-max"
                      label="Age"
                      value={filter.age}
                      onValue={(age) => setFilter({ ...filter, age })}
                    />
                    <Input
                      type="select"
                      label="Struggles"
                      placeholder="Please Select"
                      value={filter.struggles}
                      onValue={(struggles) =>
                        setFilter({ ...filter, struggles })
                      }
                    />
                    <Input
                      type="select"
                      label="Symptoms"
                      placeholder="Please Select"
                      value={filter.symptoms}
                      onValue={(symptoms) => setFilter({ ...filter, symptoms })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Please Select"
                      value={filter.interests}
                      onValue={(interests) =>
                        setFilter({ ...filter, interests })
                      }
                    />
                    <Input
                      type="text"
                      label="Bio"
                      placeholder="Please Enter"
                      value={filter.bio}
                      onValue={(bio) => setFilter({ ...filter, bio })}
                    />
                  </Grid>
                )}
                {filterTabs === 1 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Social Media"
                      placeholder="Select Select"
                      value={filter.socialMedia}
                      onValue={(socialMedia) =>
                        setFilter({ ...filter, socialMedia })
                      }
                    />
                    <Input
                      type="select"
                      label="Theme"
                      placeholder="Select Select"
                      value={filter.theme}
                      onValue={(theme) => setFilter({ ...filter, theme })}
                    />
                    <Input
                      type="select"
                      label="Disease Area (HCP)"
                      placeholder="Select Select"
                      value={filter.diseaseAreaBA}
                      onValue={(diseaseAreaBA) =>
                        setFilter({ ...filter, diseaseAreaBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Struggle"
                      placeholder="Select Select"
                      value={filter.struggle}
                      onValue={(struggle) => setFilter({ ...filter, struggle })}
                    />
                    <Input
                      type="select"
                      label="Symptom"
                      placeholder="Select Select"
                      value={filter.symptom}
                      onValue={(symptom) => setFilter({ ...filter, symptom })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Select Select"
                      value={filter.interestBA}
                      onValue={(interestBA) =>
                        setFilter({ ...filter, interestBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Sentiment"
                      placeholder="Select Select"
                      value={filter.sentiment}
                      onValue={(sentiment) =>
                        setFilter({ ...filter, sentiment })
                      }
                    />
                    <Input
                      type="select"
                      label="Language"
                      placeholder="Select Select"
                      value={filter.language}
                      onValue={(language) => setFilter({ ...filter, language })}
                    />
                    <Input
                      type="select"
                      label="Brand"
                      placeholder="Select Select"
                      value={filter.brand}
                      onValue={(brand) => setFilter({ ...filter, brand })}
                    />
                    <Input
                      type="select"
                      label="Product"
                      placeholder="Select Select"
                      value={filter.product}
                      onValue={(product) => setFilter({ ...filter, product })}
                    />
                    <Input
                      type="min-max"
                      label="Likes"
                      value={filter.likes}
                      onValue={(likes) => setFilter({ ...filter, likes })}
                    />
                    <Input
                      type="min-max"
                      label="Comments"
                      value={filter.comments}
                      onValue={(comments) => setFilter({ ...filter, comments })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.startDate,
                          onValue: (startDate) =>
                            setFilter({ ...filter, startDate }),
                          type: 'date',
                          placeholder: 'From',
                        },
                        {
                          value: filter.endDate,
                          onValue: (endDate) =>
                            setFilter({ ...filter, endDate }),
                          type: 'date',
                          placeholder: 'To',
                        },
                      ]}
                    />
                    <Input
                      type="text"
                      label="Keyword"
                      placeholder="Select Enter"
                      value={filter.keyword}
                      onValue={(keyword) => setFilter({ ...filter, keyword })}
                    />
                  </Grid>
                )}
                <ManageSMLFilterActions direction="horizontal">
                  <Button color="primary" variant="contained">
                    Filter
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear filter
                  </Button>
                </ManageSMLFilterActions>
              </ManageSMLPageFilter>
            </Collapse>
          </CardWithText>
          <Card>
            <Grid columns={2}>
              <Stack>
                <InputLabel>Most Mentioned Symptoms</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Most Mentioned Struggles</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Timeline of Most Mentioned Symptoms</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <ExtendedLineChart
                    labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                    data={[5, 30, 10, 40, 15]}
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Timeline of Most Mentioned Struggles</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <ExtendedLineChart
                    labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                    data={[5, 30, 10, 40, 15]}
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Sentiment Analysis - Symptoms</InputLabel>
                <PieChart
                  style={{ width: '50%' }}
                  labels={['Positive', 'Negative', 'Neutral']}
                  data={[52, 23, 14]}
                />
              </Stack>
              <Stack>
                <InputLabel>Sentiment Analysis - Struggles</InputLabel>
                <PieChart
                  style={{ width: '50%' }}
                  labels={['Positive', 'Negative', 'Neutral']}
                  data={[52, 23, 14]}
                />
              </Stack>
              <Stack>
                <InputLabel>Most Used Words with Symptoms</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Used Words with Struggles</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Used Hashtags with Symptoms</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Used Hashtags with Struggles</InputLabel>
                <img alt="text" src="/static/assets/images/Wordmap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Used Emojis with Symptoms</InputLabel>
                <img alt="text" src="/static/assets/images/Emojimap.jpg" />
              </Stack>

              <Stack>
                <InputLabel>Most Used Emojis with Struggles</InputLabel>
                <img alt="text" src="/static/assets/images/Emojimap.jpg" />
              </Stack>
              <Stack>
                <InputLabel>Most Mentioned Phrases - Symptoms</InputLabel>
                <Table
                  head={[
                    {
                      reference: 'phrase',
                      label: 'Phrase',
                      visible: true,
                    },
                    {
                      reference: 'volume',
                      label: 'Volume',
                      visible: true,
                    },
                    {
                      reference: 'sentiment',
                      label: 'Sentiment',
                      visible: true,
                    },
                  ]}
                  items={[]}
                  renderItem={() => {}}
                />
                <Pagination count={3} />
              </Stack>

              <Stack>
                <InputLabel>Most Mentioned Phrases - Struggles</InputLabel>
                <Table
                  head={[
                    {
                      reference: 'phrase',
                      label: 'Phrase',
                      visible: true,
                    },
                    {
                      reference: 'volume',
                      label: 'Volume',
                      visible: true,
                    },
                    {
                      reference: 'sentiment',
                      label: 'Sentiment',
                      visible: true,
                    },
                  ]}
                  items={[]}
                  renderItem={() => {}}
                />
                <Pagination count={3} />
              </Stack>
            </Grid>
          </Card>
        </>
      )}
      {tabs === 4 && (
        <>
          <CardWithText
            title="Demographics"
            description="More than 30.7k likes"
            actions={[
              <Button
                color={filterOpen ? 'secondary' : 'default'}
                variant="contained"
                onClick={toggleFilter}
                startIcon={<SlidersHorizontalIcon width="18" height="18" />}
              >
                Filters
              </Button>,
            ]}
          >
            <Collapse in={filterOpen}>
              <ManageSMLPageFilter>
                <Tabs
                  tabs={['Author', 'Post']}
                  value={filterTabs}
                  onValue={setFilterTabs}
                />
                {filterTabs === 0 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Stakeholder"
                      placeholder="Please Select"
                      value={filter.stakeholder}
                      onValue={(stakeholder) =>
                        setFilter({ ...filter, stakeholder })
                      }
                    />
                    <Input
                      type="select"
                      label="Gender"
                      placeholder="Please Select"
                      value={filter.gender}
                      onValue={(gender) => setFilter({ ...filter, gender })}
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="select"
                      label="Disease Area"
                      placeholder="Please Select"
                      value={filter.diseaseArea}
                      onValue={(diseaseArea) =>
                        setFilter({ ...filter, diseaseArea })
                      }
                    />
                    <Input
                      type="select"
                      label="Location"
                      placeholder="Please Select"
                      value={filter.location}
                      onValue={(location) => setFilter({ ...filter, location })}
                    />
                    <Input
                      type="select"
                      label="Ethnicity"
                      placeholder="Please Select"
                      value={filter.ethnicity}
                      onValue={(ethnicity) =>
                        setFilter({ ...filter, ethnicity })
                      }
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="min-max"
                      label="Age"
                      value={filter.age}
                      onValue={(age) => setFilter({ ...filter, age })}
                    />
                    <Input
                      type="select"
                      label="Struggles"
                      placeholder="Please Select"
                      value={filter.struggles}
                      onValue={(struggles) =>
                        setFilter({ ...filter, struggles })
                      }
                    />
                    <Input
                      type="select"
                      label="Symptoms"
                      placeholder="Please Select"
                      value={filter.symptoms}
                      onValue={(symptoms) => setFilter({ ...filter, symptoms })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Please Select"
                      value={filter.interests}
                      onValue={(interests) =>
                        setFilter({ ...filter, interests })
                      }
                    />
                    <Input
                      type="text"
                      label="Bio"
                      placeholder="Please Enter"
                      value={filter.bio}
                      onValue={(bio) => setFilter({ ...filter, bio })}
                    />
                  </Grid>
                )}
                {filterTabs === 1 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Social Media"
                      placeholder="Select Select"
                      value={filter.socialMedia}
                      onValue={(socialMedia) =>
                        setFilter({ ...filter, socialMedia })
                      }
                    />
                    <Input
                      type="select"
                      label="Theme"
                      placeholder="Select Select"
                      value={filter.theme}
                      onValue={(theme) => setFilter({ ...filter, theme })}
                    />
                    <Input
                      type="select"
                      label="Disease Area (HCP)"
                      placeholder="Select Select"
                      value={filter.diseaseAreaBA}
                      onValue={(diseaseAreaBA) =>
                        setFilter({ ...filter, diseaseAreaBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Struggle"
                      placeholder="Select Select"
                      value={filter.struggle}
                      onValue={(struggle) => setFilter({ ...filter, struggle })}
                    />
                    <Input
                      type="select"
                      label="Symptom"
                      placeholder="Select Select"
                      value={filter.symptom}
                      onValue={(symptom) => setFilter({ ...filter, symptom })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Select Select"
                      value={filter.interestBA}
                      onValue={(interestBA) =>
                        setFilter({ ...filter, interestBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Sentiment"
                      placeholder="Select Select"
                      value={filter.sentiment}
                      onValue={(sentiment) =>
                        setFilter({ ...filter, sentiment })
                      }
                    />
                    <Input
                      type="select"
                      label="Language"
                      placeholder="Select Select"
                      value={filter.language}
                      onValue={(language) => setFilter({ ...filter, language })}
                    />
                    <Input
                      type="select"
                      label="Brand"
                      placeholder="Select Select"
                      value={filter.brand}
                      onValue={(brand) => setFilter({ ...filter, brand })}
                    />
                    <Input
                      type="select"
                      label="Product"
                      placeholder="Select Select"
                      value={filter.product}
                      onValue={(product) => setFilter({ ...filter, product })}
                    />
                    <Input
                      type="min-max"
                      label="Likes"
                      value={filter.likes}
                      onValue={(likes) => setFilter({ ...filter, likes })}
                    />
                    <Input
                      type="min-max"
                      label="Comments"
                      value={filter.comments}
                      onValue={(comments) => setFilter({ ...filter, comments })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.startDate,
                          onValue: (startDate) =>
                            setFilter({ ...filter, startDate }),
                          type: 'date',
                          placeholder: 'From',
                        },
                        {
                          value: filter.endDate,
                          onValue: (endDate) =>
                            setFilter({ ...filter, endDate }),
                          type: 'date',
                          placeholder: 'To',
                        },
                      ]}
                    />
                    <Input
                      type="text"
                      label="Keyword"
                      placeholder="Select Enter"
                      value={filter.keyword}
                      onValue={(keyword) => setFilter({ ...filter, keyword })}
                    />
                  </Grid>
                )}
                <ManageSMLFilterActions direction="horizontal">
                  <Button color="primary" variant="contained">
                    Filter
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear filter
                  </Button>
                </ManageSMLFilterActions>
              </ManageSMLPageFilter>
            </Collapse>
          </CardWithText>
          <Card>
            <Grid columns={2}>
              <GridCell columnSpan={2}>
                <Stack>
                  <InputLabel>Total Mentions - Brand</InputLabel>
                  <div
                    style={{ width: '100%', height: 300, margin: '50px 0px' }}
                  >
                    <BarChart
                      labels={[
                        '#multiple',
                        '#ms',
                        '#pain',
                        '#awareness',
                        '#hashtag',
                        '#hashtag',
                        '#hashtag',
                        '#hashtag',
                        '#hashtag',
                        '#hashtag',
                      ]}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [
                            1000, 760, 660, 620, 504, 500, 300, 200, 100, 50,
                          ],
                        },
                      ]}
                      verticalLabel="Number of mentions"
                    />
                  </div>
                </Stack>
              </GridCell>
              <Stack>
                <InputLabel>Sentiment Analysis - Brand</InputLabel>
                <PieChart
                  labels={['Positive', 'Negative', 'Neutral']}
                  data={[52, 23, 14]}
                />
              </Stack>
              <Stack>
                <InputLabel>Sentiment Analysis - Product</InputLabel>
                <PieChart
                  labels={['Positive', 'Negative', 'Neutral']}
                  data={[52, 23, 14]}
                />
              </Stack>
              <Stack>
                <InputLabel>Total Mentions - Brand</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Total Mentions - Brand</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Total Mentions - Brand</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Total Mentions - Brand</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
              </Stack>
              <Stack>
                <InputLabel>Total Mentions - Brand</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <BarChart
                    labels={[
                      '#multiple',
                      '#ms',
                      '#pain',
                      '#awareness',
                      '#hashtag',
                    ]}
                    data={[
                      {
                        color: `${Theme.palette.primary.main}`,
                        values: [50, 30, 20, 10, 5],
                      },
                    ]}
                    verticalLabel="Number of mentions"
                  />
                </div>
              </Stack>
            </Grid>
          </Card>
        </>
      )}
      {tabs === 5 && (
        <>
          <CardWithText
            title="AI Consultant"
            description="More than 30.7k posts"
            actions={[
              <Button
                color={filterOpen ? 'secondary' : 'default'}
                variant="contained"
                onClick={toggleFilter}
                startIcon={<SlidersHorizontalIcon width="18" height="18" />}
              >
                Filters
              </Button>,
            ]}
          >
            <Collapse in={filterOpen}>
              <ManageSMLPageFilter>
                <Tabs
                  tabs={['Author', 'Post']}
                  value={filterTabs}
                  onValue={setFilterTabs}
                />
                {filterTabs === 0 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Stakeholder"
                      placeholder="Please Select"
                      value={filter.stakeholder}
                      onValue={(stakeholder) =>
                        setFilter({ ...filter, stakeholder })
                      }
                    />
                    <Input
                      type="select"
                      label="Gender"
                      placeholder="Please Select"
                      value={filter.gender}
                      onValue={(gender) => setFilter({ ...filter, gender })}
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="select"
                      label="Disease Area"
                      placeholder="Please Select"
                      value={filter.diseaseArea}
                      onValue={(diseaseArea) =>
                        setFilter({ ...filter, diseaseArea })
                      }
                    />
                    <Input
                      type="select"
                      label="Location"
                      placeholder="Please Select"
                      value={filter.location}
                      onValue={(location) => setFilter({ ...filter, location })}
                    />
                    <Input
                      type="select"
                      label="Ethnicity"
                      placeholder="Please Select"
                      value={filter.ethnicity}
                      onValue={(ethnicity) =>
                        setFilter({ ...filter, ethnicity })
                      }
                      options={[
                        { value: 0, label: 'Male' },
                        { value: 1, label: 'Female' },
                        { value: 2, label: 'Other' },
                      ]}
                    />
                    <Input
                      type="min-max"
                      label="Age"
                      value={filter.age}
                      onValue={(age) => setFilter({ ...filter, age })}
                    />
                    <Input
                      type="select"
                      label="Struggles"
                      placeholder="Please Select"
                      value={filter.struggles}
                      onValue={(struggles) =>
                        setFilter({ ...filter, struggles })
                      }
                    />
                    <Input
                      type="select"
                      label="Symptoms"
                      placeholder="Please Select"
                      value={filter.symptoms}
                      onValue={(symptoms) => setFilter({ ...filter, symptoms })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Please Select"
                      value={filter.interests}
                      onValue={(interests) =>
                        setFilter({ ...filter, interests })
                      }
                    />
                    <Input
                      type="text"
                      label="Bio"
                      placeholder="Please Enter"
                      value={filter.bio}
                      onValue={(bio) => setFilter({ ...filter, bio })}
                    />
                  </Grid>
                )}
                {filterTabs === 1 && (
                  <Grid columns={4}>
                    <Input
                      type="select"
                      label="Social Media"
                      placeholder="Select Select"
                      value={filter.socialMedia}
                      onValue={(socialMedia) =>
                        setFilter({ ...filter, socialMedia })
                      }
                    />
                    <Input
                      type="select"
                      label="Theme"
                      placeholder="Select Select"
                      value={filter.theme}
                      onValue={(theme) => setFilter({ ...filter, theme })}
                    />
                    <Input
                      type="select"
                      label="Disease Area (HCP)"
                      placeholder="Select Select"
                      value={filter.diseaseAreaBA}
                      onValue={(diseaseAreaBA) =>
                        setFilter({ ...filter, diseaseAreaBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Struggle"
                      placeholder="Select Select"
                      value={filter.struggle}
                      onValue={(struggle) => setFilter({ ...filter, struggle })}
                    />
                    <Input
                      type="select"
                      label="Symptom"
                      placeholder="Select Select"
                      value={filter.symptom}
                      onValue={(symptom) => setFilter({ ...filter, symptom })}
                    />
                    <Input
                      type="select"
                      label="Interests"
                      placeholder="Select Select"
                      value={filter.interestBA}
                      onValue={(interestBA) =>
                        setFilter({ ...filter, interestBA })
                      }
                    />
                    <Input
                      type="select"
                      label="Sentiment"
                      placeholder="Select Select"
                      value={filter.sentiment}
                      onValue={(sentiment) =>
                        setFilter({ ...filter, sentiment })
                      }
                    />
                    <Input
                      type="select"
                      label="Language"
                      placeholder="Select Select"
                      value={filter.language}
                      onValue={(language) => setFilter({ ...filter, language })}
                    />
                    <Input
                      type="select"
                      label="Brand"
                      placeholder="Select Select"
                      value={filter.brand}
                      onValue={(brand) => setFilter({ ...filter, brand })}
                    />
                    <Input
                      type="select"
                      label="Product"
                      placeholder="Select Select"
                      value={filter.product}
                      onValue={(product) => setFilter({ ...filter, product })}
                    />
                    <Input
                      type="min-max"
                      label="Likes"
                      value={filter.likes}
                      onValue={(likes) => setFilter({ ...filter, likes })}
                    />
                    <Input
                      type="min-max"
                      label="Comments"
                      value={filter.comments}
                      onValue={(comments) => setFilter({ ...filter, comments })}
                    />
                    <InputGroup
                      label="Date"
                      inputRatio="1fr 1fr"
                      elements={[
                        {
                          value: filter.startDate,
                          onValue: (startDate) =>
                            setFilter({ ...filter, startDate }),
                          type: 'date',
                          placeholder: 'From',
                        },
                        {
                          value: filter.endDate,
                          onValue: (endDate) =>
                            setFilter({ ...filter, endDate }),
                          type: 'date',
                          placeholder: 'To',
                        },
                      ]}
                    />
                    <Input
                      type="text"
                      label="Keyword"
                      placeholder="Select Enter"
                      value={filter.keyword}
                      onValue={(keyword) => setFilter({ ...filter, keyword })}
                    />
                  </Grid>
                )}
                <ManageSMLFilterActions direction="horizontal">
                  <Button color="primary" variant="contained">
                    Filter
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={clearFilters}
                  >
                    Clear filter
                  </Button>
                </ManageSMLFilterActions>
              </ManageSMLPageFilter>
            </Collapse>
          </CardWithText>
          <CardWithText title="Remaining Tokens">{/* <Chat /> */}</CardWithText>
        </>
      )}

      <Stack>
        <Button color="default" variant="contained" onClick={openSiModal}>
          Export
        </Button>
      </Stack>
      {siModal && <SMLInfo info={[]} onClose={closeSiModal} />}
    </ManageSMLMain>
  );
};

export default ManageSMLPage;
