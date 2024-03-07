import React, { useState } from 'react';
import {
  SmlPageMain,
  SmlPageFilter,
  SmlPageFilterActions,
} from 'features/sml-reports/styles';
import { CardWithText, CheckboxTable, Tabs } from 'components/custom';
import { SlidersHorizontalIcon } from 'components/svg';
import { Button, Card, Input, Pagination } from 'components/ui';
import { Grid, Stack } from 'components/system';
import { Collapse } from '@mui/material';
import { DGenerateSmlFilter } from 'features/sml-reports/data';
import { TTableRenderItemObject } from 'components/custom/table/types';
import { InputLabel } from 'components/ui/input/styles';
import { BarChart, ExtendedLineChart, PieChart } from 'components/csr';
import Theme from 'theme';

const SMLReportPage = () => {
  const [filter, setFilter] = useState<any>(DGenerateSmlFilter());

  const [filterOpen, setFilterOpen] = useState(false);

  const [tabs, setTabs] = useState(0);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const clearFilters = () => {
    setFilter(DGenerateSmlFilter());
  };

  const renderItem = ({ cell }: TTableRenderItemObject) => '';

  const [mainTabs, setMainTabs] = useState(0);

  return (
    <SmlPageMain>
      <Tabs
        value={mainTabs}
        onValue={setMainTabs}
        tabs={[
          'Brand Affinity',
          'Symptoms',
          'Hashtags',
          'Demographics',
          'MIP',
          'Suggestion',
        ]}
      />
      {mainTabs === 0 && (
        <Stack>
          <CardWithText
            title="Brand Affinity"
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
              <Button color="default" variant="contained" onClick={() => {}}>
                Export
              </Button>,
              <Button color="primary" variant="contained" onClick={() => {}}>
                Create SML
              </Button>,
            ]}
          >
            <Stack>
              <Collapse in={filterOpen}>
                <SmlPageFilter>
                  <Tabs
                    value={tabs}
                    onValue={setTabs}
                    tabs={[
                      'Reports',
                      'Competitive Analysis',
                      'Demographics',
                      'Insights',
                    ]}
                  />
                  {tabs === 0 && (
                    <Grid columns={4}>
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
                        label="Language"
                        placeholder="Please Select"
                        value={filter.language}
                        onValue={(language) =>
                          setFilter({ ...filter, language })
                        }
                      />
                      <Input
                        type="select"
                        label="Platform"
                        placeholder="Please Select"
                        value={filter.platform}
                        onValue={(platform) =>
                          setFilter({ ...filter, platform })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 1 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="Company"
                        placeholder="Please Select"
                        value={filter.company}
                        onValue={(company) => setFilter({ ...filter, company })}
                      />
                      <Input
                        type="select"
                        label="Product"
                        placeholder="Please Select"
                        value={filter.product}
                        onValue={(product) => setFilter({ ...filter, product })}
                      />
                    </Grid>
                  )}
                  {tabs === 2 && (
                    <Grid columns={4}>
                      <Input
                        type="min-max"
                        label="Age"
                        placeholder="Please Select"
                        value={filter.age}
                        onValue={(age) => setFilter({ ...filter, age })}
                      />
                      <Input
                        type="select"
                        label="Gender"
                        placeholder="Please Select"
                        value={filter.gender}
                        onValue={(gender) => setFilter({ ...filter, gender })}
                      />
                      <Input
                        type="select"
                        label="Ethnicity"
                        placeholder="Please Select"
                        value={filter.ethnicity}
                        onValue={(ethnicity) =>
                          setFilter({ ...filter, ethnicity })
                        }
                      />
                      <Input
                        type="select"
                        label="Location"
                        placeholder="Please Select"
                        value={filter.location}
                        onValue={(location) =>
                          setFilter({ ...filter, location })
                        }
                      />
                      <Input
                        type="select"
                        label="Stakeholder"
                        placeholder="Please Select"
                        value={filter.stakeholder}
                        onValue={(stakeholder) =>
                          setFilter({ ...filter, stakeholder })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 3 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="hashtag"
                        placeholder="Please Select"
                        value={filter.hashtag}
                        onValue={(hashtag) => setFilter({ ...filter, hashtag })}
                      />
                      <Input
                        type="select"
                        label="Keyword"
                        placeholder="Please Select"
                        value={filter.keyword}
                        onValue={(keyword) => setFilter({ ...filter, keyword })}
                      />
                      <Input
                        type="select"
                        label="Sentiment"
                        placeholder="Please Select"
                        value={filter.sentiment}
                        onValue={(sentiment) =>
                          setFilter({ ...filter, sentiment })
                        }
                      />
                      <Input
                        type="select"
                        label="Symptom"
                        placeholder="Please Select"
                        value={filter.symptom}
                        onValue={(symptom) => setFilter({ ...filter, symptom })}
                      />
                      <Input
                        type="select"
                        label="Mention"
                        placeholder="Please Select"
                        value={filter.mention}
                        onValue={(mention) => setFilter({ ...filter, mention })}
                      />
                      <Input
                        type="min-max"
                        label="Volume"
                        placeholder="Please Select"
                        value={filter.volume}
                        onValue={(volume) => setFilter({ ...filter, volume })}
                      />
                    </Grid>
                  )}
                  <SmlPageFilterActions direction="horizontal">
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
                  </SmlPageFilterActions>
                </SmlPageFilter>
              </Collapse>
            </Stack>
          </CardWithText>
          <Card>
            <Stack>
              <Stack direction="horizontal">
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
                  <InputLabel>Total Mentions - Product</InputLabel>
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
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Daily Mentions - Brand</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <ExtendedLineChart
                      labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                      data={[5, 30, 10, 40, 15]}
                    />
                  </div>
                </Stack>
                <Stack>
                  <InputLabel>Daily Mentions - Product</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <ExtendedLineChart
                      labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                      data={[5, 30, 10, 40, 15]}
                    />
                  </div>
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Sentiment Analysis - Brand</InputLabel>
                  <PieChart
                    style={{ width: '50%' }}
                    labels={['Positive', 'Negative', 'Neutral']}
                    data={[52, 23, 14]}
                  />
                </Stack>
                <Stack>
                  <InputLabel>Sentiment Analysis - Product</InputLabel>
                  <PieChart
                    style={{ width: '50%' }}
                    labels={['Positive', 'Negative', 'Neutral']}
                    data={[52, 23, 14]}
                  />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Wordmap - Brand</InputLabel>
                  <img alt="text" src="/static/assets/images/Wordmap.jpg" />
                </Stack>
                <Stack>
                  <InputLabel>Wordmap - Product</InputLabel>
                  <img alt="text" src="/static/assets/images/Wordmap.jpg" />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel> Emojimap - Brand</InputLabel>
                  <img alt="text" src="/static/assets/images/Emojimap.jpg" />
                </Stack>
                <Stack>
                  <InputLabel> Emojimap - Product</InputLabel>
                  <img alt="text" src="/static/assets/images/Emojimap.jpg" />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Most Mentioned Phrases - Brand</InputLabel>
                  <CheckboxTable
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
                  <Pagination
                    style={{ justifyContent: 'right' }}
                    align="center"
                    count={3}
                  />
                </Stack>
                <Stack>
                  <InputLabel>Most Mentioned Phrases - Product</InputLabel>
                  <CheckboxTable
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
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      )}
      {mainTabs === 1 && (
        <Stack>
          <CardWithText
            title="Symptoms"
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
              <Button color="default" variant="contained" onClick={() => {}}>
                Export
              </Button>,
              <Button color="primary" variant="contained" onClick={() => {}}>
                Create SML
              </Button>,
            ]}
          >
            <Stack>
              <Collapse in={filterOpen}>
                <SmlPageFilter>
                  <Tabs
                    value={tabs}
                    onValue={setTabs}
                    tabs={[
                      'Reports',
                      'Competitive Analysis',
                      'Demographics',
                      'Insights',
                    ]}
                  />
                  {tabs === 0 && (
                    <Grid columns={4}>
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
                        label="Language"
                        placeholder="Please Select"
                        value={filter.language}
                        onValue={(language) =>
                          setFilter({ ...filter, language })
                        }
                      />
                      <Input
                        type="select"
                        label="Platform"
                        placeholder="Please Select"
                        value={filter.platform}
                        onValue={(platform) =>
                          setFilter({ ...filter, platform })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 1 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="Company"
                        placeholder="Please Select"
                        value={filter.company}
                        onValue={(company) => setFilter({ ...filter, company })}
                      />
                      <Input
                        type="select"
                        label="Product"
                        placeholder="Please Select"
                        value={filter.product}
                        onValue={(product) => setFilter({ ...filter, product })}
                      />
                    </Grid>
                  )}
                  {tabs === 2 && (
                    <Grid columns={4}>
                      <Input
                        type="min-max"
                        label="Age"
                        placeholder="Please Select"
                        value={filter.age}
                        onValue={(age) => setFilter({ ...filter, age })}
                      />
                      <Input
                        type="select"
                        label="Gender"
                        placeholder="Please Select"
                        value={filter.gender}
                        onValue={(gender) => setFilter({ ...filter, gender })}
                      />
                      <Input
                        type="select"
                        label="Ethnicity"
                        placeholder="Please Select"
                        value={filter.ethnicity}
                        onValue={(ethnicity) =>
                          setFilter({ ...filter, ethnicity })
                        }
                      />
                      <Input
                        type="select"
                        label="Location"
                        placeholder="Please Select"
                        value={filter.location}
                        onValue={(location) =>
                          setFilter({ ...filter, location })
                        }
                      />
                      <Input
                        type="select"
                        label="Stakeholder"
                        placeholder="Please Select"
                        value={filter.stakeholder}
                        onValue={(stakeholder) =>
                          setFilter({ ...filter, stakeholder })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 3 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="hashtag"
                        placeholder="Please Select"
                        value={filter.hashtag}
                        onValue={(hashtag) => setFilter({ ...filter, hashtag })}
                      />
                      <Input
                        type="select"
                        label="Keyword"
                        placeholder="Please Select"
                        value={filter.keyword}
                        onValue={(keyword) => setFilter({ ...filter, keyword })}
                      />
                      <Input
                        type="select"
                        label="Sentiment"
                        placeholder="Please Select"
                        value={filter.sentiment}
                        onValue={(sentiment) =>
                          setFilter({ ...filter, sentiment })
                        }
                      />
                      <Input
                        type="select"
                        label="Symptom"
                        placeholder="Please Select"
                        value={filter.symptom}
                        onValue={(symptom) => setFilter({ ...filter, symptom })}
                      />
                      <Input
                        type="select"
                        label="Mention"
                        placeholder="Please Select"
                        value={filter.mention}
                        onValue={(mention) => setFilter({ ...filter, mention })}
                      />
                      <Input
                        type="min-max"
                        label="Volume"
                        placeholder="Please Select"
                        value={filter.volume}
                        onValue={(volume) => setFilter({ ...filter, volume })}
                      />
                    </Grid>
                  )}
                  <SmlPageFilterActions direction="horizontal">
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
                  </SmlPageFilterActions>
                </SmlPageFilter>
              </Collapse>
            </Stack>
          </CardWithText>
          <Card>
            <Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Total Mentions - Symptom</InputLabel>
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
                  <InputLabel>Daily Mentions - All</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <ExtendedLineChart
                      labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                      data={[5, 30, 10, 40, 15]}
                    />
                  </div>
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Total Mentions - Major Symptom</InputLabel>
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
                  <InputLabel>Daily Mentions - Major Symptom</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <ExtendedLineChart
                      labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                      data={[5, 30, 10, 40, 15]}
                    />
                  </div>
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Total Mentions - Unmet Symptom</InputLabel>
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
                  <Pagination align="center" count={3} />
                </Stack>
                <Stack>
                  <InputLabel>Daily Mentions - Unmet Symptom</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <ExtendedLineChart
                      labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                      data={[5, 30, 10, 40, 15]}
                    />
                  </div>
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Total Mentions - Stigmatized Symptom</InputLabel>
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
                  <Pagination align="center" count={3} />
                </Stack>
                <Stack>
                  <InputLabel>Daily Mentions - Stigmatized Symptom</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <ExtendedLineChart
                      labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                      data={[5, 30, 10, 40, 15]}
                    />
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </Card>
          <Card>
            <Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Wordmap - Symptoms</InputLabel>
                  <img alt="text" src="/static/assets/images/Wordmap.jpg" />
                </Stack>
                <Stack>
                  <InputLabel> Emojimap - Symptoms</InputLabel>
                  <img alt="text" src="/static/assets/images/Emojimap.jpg" />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Sentiment Analysis - Symptoms</InputLabel>
                  <PieChart
                    style={{ width: '50%' }}
                    labels={['Positive', 'Negative', 'Neutral']}
                    data={[52, 23, 14]}
                  />
                </Stack>
                <Stack>
                  <InputLabel>Most Mentioned Phrases - Symptoms</InputLabel>
                  <CheckboxTable
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
                  <Pagination align="center" count={3} />
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      )}
      {mainTabs === 2 && (
        <Stack>
          <CardWithText
            title="Hashtags"
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
              <Button color="default" variant="contained" onClick={() => {}}>
                Export
              </Button>,
              <Button color="primary" variant="contained" onClick={() => {}}>
                Create SML
              </Button>,
            ]}
          >
            <Stack>
              <Collapse in={filterOpen}>
                <SmlPageFilter>
                  <Tabs
                    value={tabs}
                    onValue={setTabs}
                    tabs={[
                      'Reports',
                      'Competitive Analysis',
                      'Demographics',
                      'Insights',
                    ]}
                  />
                  {tabs === 0 && (
                    <Grid columns={4}>
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
                        label="Language"
                        placeholder="Please Select"
                        value={filter.language}
                        onValue={(language) =>
                          setFilter({ ...filter, language })
                        }
                      />
                      <Input
                        type="select"
                        label="Platform"
                        placeholder="Please Select"
                        value={filter.platform}
                        onValue={(platform) =>
                          setFilter({ ...filter, platform })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 1 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="Company"
                        placeholder="Please Select"
                        value={filter.company}
                        onValue={(company) => setFilter({ ...filter, company })}
                      />
                      <Input
                        type="select"
                        label="Product"
                        placeholder="Please Select"
                        value={filter.product}
                        onValue={(product) => setFilter({ ...filter, product })}
                      />
                    </Grid>
                  )}
                  {tabs === 2 && (
                    <Grid columns={4}>
                      <Input
                        type="min-max"
                        label="Age"
                        placeholder="Please Select"
                        value={filter.age}
                        onValue={(age) => setFilter({ ...filter, age })}
                      />
                      <Input
                        type="select"
                        label="Gender"
                        placeholder="Please Select"
                        value={filter.gender}
                        onValue={(gender) => setFilter({ ...filter, gender })}
                      />
                      <Input
                        type="select"
                        label="Ethnicity"
                        placeholder="Please Select"
                        value={filter.ethnicity}
                        onValue={(ethnicity) =>
                          setFilter({ ...filter, ethnicity })
                        }
                      />
                      <Input
                        type="select"
                        label="Location"
                        placeholder="Please Select"
                        value={filter.location}
                        onValue={(location) =>
                          setFilter({ ...filter, location })
                        }
                      />
                      <Input
                        type="select"
                        label="Stakeholder"
                        placeholder="Please Select"
                        value={filter.stakeholder}
                        onValue={(stakeholder) =>
                          setFilter({ ...filter, stakeholder })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 3 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="hashtag"
                        placeholder="Please Select"
                        value={filter.hashtag}
                        onValue={(hashtag) => setFilter({ ...filter, hashtag })}
                      />
                      <Input
                        type="select"
                        label="Keyword"
                        placeholder="Please Select"
                        value={filter.keyword}
                        onValue={(keyword) => setFilter({ ...filter, keyword })}
                      />
                      <Input
                        type="select"
                        label="Sentiment"
                        placeholder="Please Select"
                        value={filter.sentiment}
                        onValue={(sentiment) =>
                          setFilter({ ...filter, sentiment })
                        }
                      />
                      <Input
                        type="select"
                        label="Symptom"
                        placeholder="Please Select"
                        value={filter.symptom}
                        onValue={(symptom) => setFilter({ ...filter, symptom })}
                      />
                      <Input
                        type="select"
                        label="Mention"
                        placeholder="Please Select"
                        value={filter.mention}
                        onValue={(mention) => setFilter({ ...filter, mention })}
                      />
                      <Input
                        type="min-max"
                        label="Volume"
                        placeholder="Please Select"
                        value={filter.volume}
                        onValue={(volume) => setFilter({ ...filter, volume })}
                      />
                    </Grid>
                  )}
                  <SmlPageFilterActions direction="horizontal">
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
                  </SmlPageFilterActions>
                </SmlPageFilter>
              </Collapse>
            </Stack>
          </CardWithText>
          <Card>
            <Stack direction="horizontal">
              <Stack>
                <InputLabel>Total Mentions - All</InputLabel>
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
                <Pagination align="center" count={3} />
              </Stack>
              <Stack>
                <InputLabel>Daily Mentions - All</InputLabel>
                <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                  <ExtendedLineChart
                    labels={['W0', 'W1', 'W2', 'W3', 'W4']}
                    data={[5, 30, 10, 40, 15]}
                  />
                </div>
              </Stack>
            </Stack>
          </Card>
          <Card>
            <Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Wordmap - Hashtags</InputLabel>
                  <img alt="text" src="/static/assets/images/Wordmap.jpg" />
                </Stack>
                <Stack>
                  <InputLabel> Emojimap - All</InputLabel>
                  <img alt="text" src="/static/assets/images/Emojimap.jpg" />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Sentiment Analysis - All</InputLabel>
                  <PieChart
                    style={{ width: '50%' }}
                    labels={['Positive', 'Negative', 'Neutral']}
                    data={[52, 23, 14]}
                  />
                </Stack>
                <Stack>
                  <InputLabel>Most Mentioned Phrases - All</InputLabel>
                  <CheckboxTable
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
                  <Pagination count={32} />
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      )}
      {mainTabs === 3 && (
        <Stack>
          <CardWithText
            title="Demographics"
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
              <Button color="default" variant="contained" onClick={() => {}}>
                Export
              </Button>,
              <Button color="primary" variant="contained" onClick={() => {}}>
                Create SML
              </Button>,
            ]}
          >
            <Stack>
              <Collapse in={filterOpen}>
                <SmlPageFilter>
                  <Tabs
                    value={tabs}
                    onValue={setTabs}
                    tabs={[
                      'Reports',
                      'Competitive Analysis',
                      'Demographics',
                      'Insights',
                    ]}
                  />
                  {tabs === 0 && (
                    <Grid columns={4}>
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
                        label="Language"
                        placeholder="Please Select"
                        value={filter.language}
                        onValue={(language) =>
                          setFilter({ ...filter, language })
                        }
                      />
                      <Input
                        type="select"
                        label="Platform"
                        placeholder="Please Select"
                        value={filter.platform}
                        onValue={(platform) =>
                          setFilter({ ...filter, platform })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 1 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="Company"
                        placeholder="Please Select"
                        value={filter.company}
                        onValue={(company) => setFilter({ ...filter, company })}
                      />
                      <Input
                        type="select"
                        label="Product"
                        placeholder="Please Select"
                        value={filter.product}
                        onValue={(product) => setFilter({ ...filter, product })}
                      />
                    </Grid>
                  )}
                  {tabs === 2 && (
                    <Grid columns={4}>
                      <Input
                        type="min-max"
                        label="Age"
                        placeholder="Please Select"
                        value={filter.age}
                        onValue={(age) => setFilter({ ...filter, age })}
                      />
                      <Input
                        type="select"
                        label="Gender"
                        placeholder="Please Select"
                        value={filter.gender}
                        onValue={(gender) => setFilter({ ...filter, gender })}
                      />
                      <Input
                        type="select"
                        label="Ethnicity"
                        placeholder="Please Select"
                        value={filter.ethnicity}
                        onValue={(ethnicity) =>
                          setFilter({ ...filter, ethnicity })
                        }
                      />
                      <Input
                        type="select"
                        label="Location"
                        placeholder="Please Select"
                        value={filter.location}
                        onValue={(location) =>
                          setFilter({ ...filter, location })
                        }
                      />
                      <Input
                        type="select"
                        label="Stakeholder"
                        placeholder="Please Select"
                        value={filter.stakeholder}
                        onValue={(stakeholder) =>
                          setFilter({ ...filter, stakeholder })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 3 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="hashtag"
                        placeholder="Please Select"
                        value={filter.hashtag}
                        onValue={(hashtag) => setFilter({ ...filter, hashtag })}
                      />
                      <Input
                        type="select"
                        label="Keyword"
                        placeholder="Please Select"
                        value={filter.keyword}
                        onValue={(keyword) => setFilter({ ...filter, keyword })}
                      />
                      <Input
                        type="select"
                        label="Sentiment"
                        placeholder="Please Select"
                        value={filter.sentiment}
                        onValue={(sentiment) =>
                          setFilter({ ...filter, sentiment })
                        }
                      />
                      <Input
                        type="select"
                        label="Symptom"
                        placeholder="Please Select"
                        value={filter.symptom}
                        onValue={(symptom) => setFilter({ ...filter, symptom })}
                      />
                      <Input
                        type="select"
                        label="Mention"
                        placeholder="Please Select"
                        value={filter.mention}
                        onValue={(mention) => setFilter({ ...filter, mention })}
                      />
                      <Input
                        type="min-max"
                        label="Volume"
                        placeholder="Please Select"
                        value={filter.volume}
                        onValue={(volume) => setFilter({ ...filter, volume })}
                      />
                    </Grid>
                  )}
                  <SmlPageFilterActions direction="horizontal">
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
                  </SmlPageFilterActions>
                </SmlPageFilter>
              </Collapse>
            </Stack>
          </CardWithText>
          <Card>
            <Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Age & Gender</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <BarChart
                      labels={[
                        '0-15',
                        '16-25',
                        '26-36',
                        '36-45',
                        '46-55',
                        '56-65',
                        '66-75',
                        '75+',
                      ]}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [15, 20, 25, 30, 45, 25, 7, 2],
                        },
                        {
                          color: `${Theme.palette.secondary.main}`,
                          values: [5, 10, 15, 20, 25, 18, 13, 8],
                        },
                      ]}
                      verticalLabel="% of posters"
                      horizontalLabel="Age range"
                    />
                  </div>
                </Stack>
                <Stack>
                  <InputLabel>Ethnicity</InputLabel>
                  <PieChart
                    style={{ width: '50%' }}
                    labels={['Positive', 'Negative', 'Neutral']}
                    data={[52, 23, 14]}
                  />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Location</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <BarChart
                      labels={[
                        'US',
                        'DE',
                        'CH',
                        'UK',
                        'IT',
                        'DE',
                        'CRO',
                        '',
                        '',
                        '',
                      ]}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [25, 20, 15, 12, 10, 8, 5, 3, 2, 1],
                        },
                      ]}
                      verticalLabel="% of followers"
                    />
                  </div>
                </Stack>
                <Stack>
                  <InputLabel>Interests</InputLabel>
                  <div style={{ width: 500, height: 300, margin: '50px 0px' }}>
                    <BarChart
                      labels={[
                        'US',
                        'DE',
                        'CH',
                        'UK',
                        'IT',
                        'DE',
                        'CRO',
                        '',
                        '',
                        '',
                      ]}
                      data={[
                        {
                          color: `${Theme.palette.primary.main}`,
                          values: [25, 20, 15, 12, 10, 8, 5, 3, 2, 1],
                        },
                      ]}
                      verticalLabel="% of followers"
                    />
                  </div>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      )}
      {mainTabs === 4 && (
        <Stack>
          <CardWithText
            title="MIP"
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
              <Button color="default" variant="contained" onClick={() => {}}>
                Export
              </Button>,
              <Button color="primary" variant="contained" onClick={() => {}}>
                Create SML
              </Button>,
            ]}
          >
            <Stack>
              <Collapse in={filterOpen}>
                <SmlPageFilter>
                  <Tabs
                    value={tabs}
                    onValue={setTabs}
                    tabs={[
                      'Reports',
                      'Competitive Analysis',
                      'Demographics',
                      'Insights',
                    ]}
                  />
                  {tabs === 0 && (
                    <Grid columns={4}>
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
                        label="Language"
                        placeholder="Please Select"
                        value={filter.language}
                        onValue={(language) =>
                          setFilter({ ...filter, language })
                        }
                      />
                      <Input
                        type="select"
                        label="Platform"
                        placeholder="Please Select"
                        value={filter.platform}
                        onValue={(platform) =>
                          setFilter({ ...filter, platform })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 1 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="Company"
                        placeholder="Please Select"
                        value={filter.company}
                        onValue={(company) => setFilter({ ...filter, company })}
                      />
                      <Input
                        type="select"
                        label="Product"
                        placeholder="Please Select"
                        value={filter.product}
                        onValue={(product) => setFilter({ ...filter, product })}
                      />
                    </Grid>
                  )}
                  {tabs === 2 && (
                    <Grid columns={4}>
                      <Input
                        type="min-max"
                        label="Age"
                        placeholder="Please Select"
                        value={filter.age}
                        onValue={(age) => setFilter({ ...filter, age })}
                      />
                      <Input
                        type="select"
                        label="Gender"
                        placeholder="Please Select"
                        value={filter.gender}
                        onValue={(gender) => setFilter({ ...filter, gender })}
                      />
                      <Input
                        type="select"
                        label="Ethnicity"
                        placeholder="Please Select"
                        value={filter.ethnicity}
                        onValue={(ethnicity) =>
                          setFilter({ ...filter, ethnicity })
                        }
                      />
                      <Input
                        type="select"
                        label="Location"
                        placeholder="Please Select"
                        value={filter.location}
                        onValue={(location) =>
                          setFilter({ ...filter, location })
                        }
                      />
                      <Input
                        type="select"
                        label="Stakeholder"
                        placeholder="Please Select"
                        value={filter.stakeholder}
                        onValue={(stakeholder) =>
                          setFilter({ ...filter, stakeholder })
                        }
                      />
                    </Grid>
                  )}
                  {tabs === 3 && (
                    <Grid columns={4}>
                      <Input
                        type="select"
                        label="hashtag"
                        placeholder="Please Select"
                        value={filter.hashtag}
                        onValue={(hashtag) => setFilter({ ...filter, hashtag })}
                      />
                      <Input
                        type="select"
                        label="Keyword"
                        placeholder="Please Select"
                        value={filter.keyword}
                        onValue={(keyword) => setFilter({ ...filter, keyword })}
                      />
                      <Input
                        type="select"
                        label="Sentiment"
                        placeholder="Please Select"
                        value={filter.sentiment}
                        onValue={(sentiment) =>
                          setFilter({ ...filter, sentiment })
                        }
                      />
                      <Input
                        type="select"
                        label="Symptom"
                        placeholder="Please Select"
                        value={filter.symptom}
                        onValue={(symptom) => setFilter({ ...filter, symptom })}
                      />
                      <Input
                        type="select"
                        label="Mention"
                        placeholder="Please Select"
                        value={filter.mention}
                        onValue={(mention) => setFilter({ ...filter, mention })}
                      />
                      <Input
                        type="min-max"
                        label="Volume"
                        placeholder="Please Select"
                        value={filter.volume}
                        onValue={(volume) => setFilter({ ...filter, volume })}
                      />
                    </Grid>
                  )}
                  <SmlPageFilterActions direction="horizontal">
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
                  </SmlPageFilterActions>
                </SmlPageFilter>
              </Collapse>
            </Stack>
          </CardWithText>
          <Card>
            <Stack>
              <InputLabel>Most Liked</InputLabel>
              <CheckboxTable
                head={[
                  {
                    reference: 'caption',
                    label: 'Caption',
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
          </Card>
          <Card>
            <Stack>
              <InputLabel>Most Commented</InputLabel>
              <CheckboxTable
                head={[
                  {
                    reference: 'caption',
                    label: 'Caption',
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
          </Card>
          <Card>
            <Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Wordmap - All</InputLabel>
                  <img alt="text" src="/static/assets/images/Wordmap.jpg" />
                </Stack>
                <Stack>
                  <InputLabel> Emojimap - All</InputLabel>
                  <img alt="text" src="/static/assets/images/Emojimap.jpg" />
                </Stack>
              </Stack>
              <Stack direction="horizontal">
                <Stack>
                  <InputLabel>Sentiment Analysis - All</InputLabel>
                  <PieChart
                    style={{ width: '50%' }}
                    labels={['Positive', 'Negative', 'Neutral']}
                    data={[52, 23, 14]}
                  />
                </Stack>
                <Stack>
                  <InputLabel>Most Mentioned Phrases - All</InputLabel>
                  <CheckboxTable
                    head={[
                      {
                        reference: 'phrase',
                        label: 'Phrase',
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
              </Stack>
            </Stack>
          </Card>
        </Stack>
      )}
      {mainTabs === 5 && (
        <CardWithText title="Suggestion">
          <Stack>
            <Input
              type="text"
              multiline
              rows={6}
              value={filter.suggestion}
              onValue={(suggestion) => setFilter({ ...filter, suggestion })}
            />
            <Button
              style={{ alignSelf: 'flex-end' }}
              size="large"
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </Stack>
        </CardWithText>
      )}
    </SmlPageMain>
  );
};

export default SMLReportPage;
