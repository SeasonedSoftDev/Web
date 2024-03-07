import React, { useState } from 'react';

import {
  HelpPageMain,
  HelpPageContact,
  HelpPageContactContainer,
  HelpPageIconWithTextContainer,
} from 'features/help/styles';
import { Button, Input } from 'components/ui';
import { IconWithText, Tabs } from 'components/custom';
import { Stack } from 'components/system';
import { ArrowDownIcon, EnvelopeIcon, PhoneCallIcon } from 'components/svg';
import { HelpCollapse } from 'features/help/elements';
import UsersAPI from 'api/users';
import { useSnackbar } from 'hooks';

const HelpPage = () => {
  const [tab, setTab] = useState(0);

  const initialHelpFormData = {
    topic: null,
    subject: '',
    message: '',
  };

  const [helpFormData, setHelpFormData] = useState<any>(initialHelpFormData);

  const { push } = useSnackbar();

  const topicOptions = [
    { value: 0, label: 'Acquisition Strategy' },
    { value: 1, label: 'Commission Queries' },
    { value: 2, label: 'Payment Withdrawal' },
    { value: 3, label: 'Client Activity Tracking' },
    { value: 4, label: 'Account Management' },
    { value: 5, label: 'Ambassador Program' },
    { value: 6, label: 'Privacy & Compliance' },
    { value: 7, label: 'Technical Support' },
  ];

  const sendSupportEmail = async () => {
    const { topic, subject, message } = helpFormData;

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    try {
      if (topic && trimmedSubject.length && trimmedMessage.length) {
        const formBody = {
          subject: trimmedSubject,
          message: trimmedMessage,
          topic: topic.label,
        };
        await UsersAPI.contactAdmin(formBody);
        push('Sucess submitting form');

        setHelpFormData(initialHelpFormData);
      }
    } catch (error) {
      push('Error sending form', { variant: 'error' });
    }
  };

  return (
    <HelpPageMain>
      <Stack>
        <Tabs
          value={tab}
          onValue={setTab}
          tabs={['Contact us', 'Frequently Asked Questions']}
        />
        {tab === 1 ? (
          <Stack>
            <HelpCollapse
              title="How does a campaign work with Patients Influence?"
              icon={<ArrowDownIcon />}
              text={[
                `Initiating a campaign with Patients Influence is an effortless process. After registering on our web application, you provide us with your specific campaign needs, including the type of patient influencer and target audience you're seeking.`,
                `Our proprietary algorithm uses these detailed parameters to identify potential influencers that align perfectly with your campaign needs. This advanced algorithm consists of over 15+ machine learning models which assign labels to each influencer's audience. This means that if your target is MS patients in Germany who have mentioned fatigue recently, we will connect them with influencers who have that type of audience and who offer the most value per target audience member. This intricate process assures that you're closer to a 900% ROI, making your campaigns more effective and budget-friendly.`,
                `Once we've curated a suitable list of influencers, we present it to you for approval. After you've given the go-ahead, we send an invitation to the selected influencers. If an influencer applies to your campaign, we initiate a mutual matching process. This is a unique opportunity for you and the influencer to engage and ensure a perfect fit for your campaign. In this stage, akin to a job interview, you can vet the influencers and make sure that they will adhere to the patient influencer marketing rules.`,
                `During this stage, we reveal the influencer's first name, username, and social media platform to you, but all other profile information remains confidential. We perform thorough quality assurance checks on the influencer's Instagram profile, confirming its authenticity. You can also access their Instagram account and see how the person presents themselves. We have vetted all the influencers, but this step gives more control to clients if desired.`,
                `Upon your mutual agreement to proceed, the influencer creates a campaign post and submits it for your approval. Once you've given the green light, the campaign goes live. There are campaign reports where we track total reach, likes, comments, engagement, audience overlap, cost per target, cost per click, website clicks, and many more, making sure you have a clear understanding of the campaign's impact.`,
                `Following the successful completion of the campaign, we provide you with an insightful report, analysing the performance and key metrics.`,
                `Patients Influence is committed to facilitating successful campaigns. We support you and the influencers throughout the process. We offer marketing consultation before campaigns, guiding influencers to use language that resonates with your target population. We closely watch the progress during campaigns, manage influencers, provide reminders, and share next steps. We are here to ensure a smooth, efficient, and successful campaign journey, amplifying your exposure to the right audience.`,
              ]}
            />
            <HelpCollapse
              title="How is Patients Influence revolutionizing healthcare surveys?"
              icon={<ArrowDownIcon />}
              text={[
                `Patients Influence is elevating the survey process to meet the demands of modern healthcare. Our digital platform empowers you to gather the insights you need in an innovative, efficient, and engaging way.`,
                `When setting up your survey, you'll define the parameters that matter to your organization, encompassing factors such as the demographic, geographic, and health characteristics of your target audience. Our team works collaboratively with you, ensuring each question is crafted effectively and assigned appropriate question credits for optimized results.`,
                `Upon inviting carefully selected patient influencers to take part in your survey, we provide them with clear instructions and any necessary materials. This helps to garner the most authentic and valuable responses from the individuals who matter most to your mission.`,
                `But our approach doesn't stop at merely collecting responses. We delve into the data to generate powerful insights. If a question asks, "Do you find value in our app," and a certain percentage answer 'yes', we illuminate who these individuals are. Our platform generates a detailed portrait of these respondents, highlighting demographic and interest-based information, allowing for nuanced understandings and strategic decisions.`,
                `This rich analysis is visualized in easily digestible graphs and charts, offering correlations among different variables like age, gender, interests, and responses. In a few clicks, you can explore different segments of your respondents and how they responded to your questions.`,
                `Yet, the pinnacle of our service is our unique AI-assisted analysis. We've developed an advanced artificial intelligence tool, a 'smart consultant', that sifts through the questions, answers, and participant characteristics to generate additional insights. This tool allows you to ask 'why', not just 'what', offering a multi-dimensional understanding of your survey data.`,
                `Patients Influence is with you every step of the way, supporting you in harnessing the power of patient insight. With our commitment to quality, innovation, and meaningful insights, we aim to bring healthcare closer to those it serves.`,
              ]}
            />
            <HelpCollapse
              title="How can social media listening improve our understanding of patients?"
              icon={<ArrowDownIcon />}
              text={[
                `In the realm of social media listening, Patients Influence brings an unparalleled approach. We offer an all-encompassing view of the social landscape, analyzing a robust database of over half a million social media posts.`,
                `With our platform, you can navigate the complexities of social media data, utilizing a spectrum of advanced filters that focus on specific author characteristics and post attributes. This allows you to distill insights from the chatter, helping you understand your audience like never before.
                Our sophisticated tools let you dive deeper into brand and product mentions, exploring the associated sentiments and uncovering the nuances of public opinion. We also create interactive word, emoji, and hashtag maps, presenting a compelling visual representation of frequently mentioned elements.
                `,
                `Demographic breakdowns add another layer of insights. Say, if you filter posts based on a specific symptom and sentiment, our platform can show you which demographic segment is most affected by this issue. This can inform your strategies and help you tailor your communications more effectively.`,
                `Moreover, we offer a unique feature where you can see the frequency of specific word mentions over time. This helps you identify trends and patterns, keeping you on the pulse of the conversation.`,
                `Finally, we have integrated an AI-assisted feature that lets you input your questions and get pattern-identifying responses. It's like having your personal data analyst, making social media listening more interactive, precise, and insightful.`,
                `With Patients Influence, you can truly listen to and understand your audience, driving more meaningful and impactful engagement.`,
              ]}
            />
            <HelpCollapse
              title="What makes Patients Influence different?"
              icon={<ArrowDownIcon />}
              text={[
                `At Patients Influence, we've revolutionized the patient influencer marketplace, setting a new standard of collaboration, innovation, and impact. Here's our unique edge:`,
                `Our platform is built on fairness and trust. Patient influencers pay no fees or commissions, creating a community rooted in authenticity. As our partner, you play a direct role in supporting these individuals, strengthening your brand's bond with influencers, while achieving your marketing and research objectives. We make your investments count, creating a virtuous cycle of trust and mutual benefit.`,
                `Our proprietary algorithm is an industry game-changer. We've harnessed advanced technology to ensure every dollar spent maximizes your return, making your campaigns more impactful and your surveys more insightful. You not only reduce costs but elevate value, gaining unparalleled access to the most suitable patient influencers and the most meaningful data. You gain better outcomes, more insights, at a lower cost - an unrivaled return on investment.`,
                `Our platform is built upon industry insight. Our founder, Ivan, a healthcare veteran and Roche alumni, established Patients Influence with a deep understanding of your challenges. This isn't just a platform, it's a solution, fine-tuned to meet your unique needs. As our partner, you're not merely supporting a movement, you're investing in a dynamic solution, a catalyst for change and improvement.`,
                `At Patients Influence, we bring together the best of technology, empathy, and industry expertise. We're here to drive progress, foster genuine connections, and champion a noble cause. Your partnership with us isn't just about achieving your goals, but about igniting a positive shift in the industry. Join us, let's rewrite the future of healthcare together. That's the Patients Influence promise.`,
              ]}
            />
            <HelpCollapse
              title={`What is the idea behind "Friday Impact Hours" and how does it tie into the mission of Patients Influence?`}
              icon={<ArrowDownIcon />}
              text={[
                `"Friday Impact Hours" is an initiative conceived by Ivan, the founder of Patients Influence. Born out of Ivan's personal and professional journey, it's a weekly session dedicated to guiding healthcare startups and patient-founded ventures, using Ivan's experiences in the healthcare and digital therapeutics industry.`,
                `Diagnosed with Non-Hodgkin’s Lymphoma in his last semester before graduation, didn't just overcome his disease but also defied the limits it was supposed to impose on him. He scored a perfect GPA, won a national fitness competition, and rapidly became a Key Opinion Leader in Digital Therapeutics a few years after being declared disease-free.`,
                `Having worked with Roche and being an entrepreneur himself, Ivan utilises his diverse experiences in these Friday sessions. The goal is to provide practical, real-world advice and guidance, drawing from the challenges and successes he's encountered along the way.`,
                `At the heart of "Friday Impact Hours" is the spirit of giving back. It's about contributing to a collective effort to improve the healthcare industry. By sharing his insights, Ivan aims to foster a supportive environment for new healthcare leaders and patient-founded ventures, enabling them to drive patient empowerment and progress.`,
                `Just as Patients Influence seeks to create new earning opportunities for those affected by disease, "Friday Impact Hours" is committed to nurturing ventures that have the potential to make a significant, positive difference in the healthcare landscape. Together, they represent a shared mission to enhance healthcare, demonstrating that we can achieve greater things when we collaborate.`,
              ]}
            />
          </Stack>
        ) : (
          <HelpPageContact>
            <HelpPageContactContainer>
              <Stack>
                <h2>Write to us</h2>
                <Input
                  type="select"
                  label="Topic"
                  placeholder="Select Topic"
                  value={helpFormData.topic}
                  onValue={(topic) =>
                    setHelpFormData({ ...helpFormData, topic })
                  }
                  options={topicOptions}
                />
                <Input
                  type="text"
                  label="Subject"
                  placeholder="Subject"
                  value={helpFormData.subject}
                  onValue={(subject) =>
                    setHelpFormData({ ...helpFormData, subject })
                  }
                />
                <Input
                  type="text"
                  label="Message"
                  placeholder="Please enter a message"
                  value={helpFormData.message}
                  onValue={(message) =>
                    setHelpFormData({ ...helpFormData, message })
                  }
                  multiline
                />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={sendSupportEmail}
                >
                  Send
                </Button>
              </Stack>
            </HelpPageContactContainer>
            <HelpPageContactContainer>
              <HelpPageIconWithTextContainer>
                <h2 style={{ marginBottom: '2rem' }}>Get in touch</h2>
                <Stack>
                  <IconWithText
                    icon={<PhoneCallIcon />}
                    link="https://calendly.com/patientsinfluence-client/30min"
                    title="Talk with our founder"
                    text={['Schedule a call!']}
                    style={{ cursor: 'pointer' }}
                  />
                  <IconWithText
                    icon={<EnvelopeIcon />}
                    link="mailto:client@patientsinfluence.com"
                    title="Write to our founder"
                    text={['Send an email!']}
                    style={{ cursor: 'pointer' }}
                  />
                  <IconWithText
                    icon={<PhoneCallIcon />}
                    title="Visit Us"
                    text={['Riehenring 65, 4058 Basel Switzerland']}
                    link="https://goo.gl/maps/mbiouV7WZoXBwqJDA"
                    style={{ cursor: 'pointer' }}
                  />
                </Stack>
              </HelpPageIconWithTextContainer>
            </HelpPageContactContainer>
          </HelpPageContact>
        )}
      </Stack>
    </HelpPageMain>
  );
};

export default HelpPage;
