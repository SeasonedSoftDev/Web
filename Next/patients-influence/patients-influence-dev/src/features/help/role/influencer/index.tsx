import React, { useState } from 'react';

import {
  HelpPageMain,
  HelpPageContact,
  HelpPageContactContainer,
  HelpPageIconWithTextIContainer,
} from 'features/help/styles';
import { Button, Input } from 'components/ui';
import { IconWithText, Tabs } from 'components/custom';
import { Stack } from 'components/system';
import {
  ArrowDownIcon,
  EnvelopeIcon,
  LocationIcon,
  PhoneCallIcon,
} from 'components/svg';
import { HelpCollapse } from 'features/help/elements';
import { useSnackbar } from 'hooks';
import UsersAPI from 'api/users';

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
    { value: 0, label: 'Account and Verification' },
    { value: 1, label: 'Payments and Earnings' },
    { value: 2, label: 'Campaigns and Surveys' },
    { value: 3, label: 'Technical Support' },
    { value: 4, label: 'Privacy and Compliance' },
    { value: 5, label: 'Donations & Affiliate Program' },
    { value: 6, label: 'Benefits' },
    { value: 7, label: 'General Inquiry' },
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
          tabs={['Frequently Asked Questions', 'Contact us']}
        />
        {tab === 0 ? (
          <Stack>
            <HelpCollapse
              title="What makes Patients Influence different?"
              icon={<ArrowDownIcon />}
              text={[
                "Firstly, at Patients Influence, we prioritize transparency and fairness. We don't sneak in any hidden fees or commissions - what you earn is wholly yours. No surprises!",
                "Secondly, we've engineered a distinctive algorithm, a win-win-win creation for everyone. It not only increases your earnings but also gives healthcare companies a higher return on their investments. This tool allows you to set a higher income, while we can generate revenue by identifying the perfect matches for campaigns or surveys. And that's the secret sauce - our algorithm doesn't just benefit us as a company, it also enhances the value you provide, leading to higher pay and long-lasting relationships with healthcare firms.",
                "Lastly, Patients Influence is deeply grounded in a personal journey of resilience and determination. Our founder, Ivan, a Non-Hodgkin’s Lymphoma survivor, defied all odds to excel in academics, sports, and his professional journey at Roche. Although he became the youngest Key Opinion Leader in his field, Ivan saw an opportunity to give back and bring about change. Thus, Patients Influence was born. While he laid the platform's foundation, he sees it as a shared space belonging to you, the patients. His experiences, his fight, his small victories – they're all woven into the very fabric of Patients Influence, a platform born from empathy, understanding, and a drive to create meaningful change. This is Ivan's way of leveraging his experiences for the greater good. That, in essence, encapsulates the Patients Influence difference!",
              ]}
            />
            <HelpCollapse
              title="Why do I need to share my personal details for the verification process?"
              icon={<ArrowDownIcon />}
              text={[
                "Great question! We're all about creating meaningful connections here at Patients Influence. It might seem like we're asking for quite a bit, but we promise it's all with a good reason. Your personal information, like where you live, your birthday, and your experiences as a patient or caregiver, gives us a glimpse into your world.",
                "And your income preference? Here's where it gets exciting - we're out to change the game and put patients firmly in the driver's seat. You should have the power to decide your worth, and your income preference helps us steer this industry change. With this knowledge, we can better match you with campaigns and surveys that align with your journey. It's like matchmaking - the more we understand you, the better matches we can make!",
              ]}
            />
            <HelpCollapse
              title="What's the benefit of the verification process?"
              icon={<ArrowDownIcon />}
              text={[
                "Think of the verification process as your pass to a trusted and secure community. Our team goes through your details, ensuring all the t's are crossed and i's dotted. Once verified, you're not just a member, you're a recognized part of our community, opening up access to the plethora of resources the platform offers—campaign, survey, benefits, and income tabs. This verification also gives healthcare companies confidence that they're connecting with genuine individuals like you.",
                "And an added bonus? It safeguards your opportunities by ensuring that only authentic patient influencers, not impostors, can participate. It's our way of preserving the integrity of our community and securing your place within it.",
              ]}
            />
            <HelpCollapse
              title="Why should I link my Instagram account during verification?"
              icon={<ArrowDownIcon />}
              text={[
                "Linking your Instagram account is essentially a digital handshake between you and Patients Influence. It's not about us accessing your account, rather it's a way for you to prove that the account genuinely belongs to you and that you are who you say you are. This reassures us and our healthcare partners that there's a real, authentic person behind the screen.",
                "And don't worry your follower count isn't our focus – instead, we're interested in your story, your experiences, and your unique voice. These are what truly help us match you with the most fitting campaigns and allow healthcare companies to appreciate the genuine value you bring as a patient influencer.",
              ]}
            />
            <HelpCollapse
              title="How can I increase my earnings on Patients Influence?"
              icon={<ArrowDownIcon />}
              text={[
                `You've got some excellent options to increase your earnings with Patients Influence! First off, your active participation in campaigns and surveys - by sharing your unique journey and experiences, you're directly impacting the healthcare industry while growing your income!
                Then we've got the friendly side of things – inviting your friends to join us. It's simple, really. You share your unique affiliate link (you can find it in your account tab) with them. For every friend who signs up and becomes active, you both enjoy an earnings boost!`,
                `But wait, there's more. Let's talk about our donation initiative. After each campaign and survey, part of the profits are pooled and shared with patients in the same disease community. Think of it like a shared victory – as your community grows and engages with campaigns and surveys, you all benefit!`,
              ]}
            />
            <HelpCollapse
              title="Should I participate in the Patients Influence affiliate program?
              "
              icon={<ArrowDownIcon />}
              text={[
                `We celebrate the growth of our community, and we believe those who facilitate this growth should be rewarded! Participating in our affiliate program allows you to expand our supportive community and earn additional bonuses for yourself. Invite fellow patients via your affiliate link available in your account tab. If they sign up and are approved, you receive a bonus that equals to 1% of their future earnings.`,
                `Also, a bonus that equals to 1% of your future earnings will be distributed equally among those you invited. This offers a unique opportunity to inspire others, boost your earnings, and contribute to our mission of redirecting resources from the traditional marketing channels to patients.`,
              ]}
            />
            <HelpCollapse
              title="When will Patients Influence be up and running in full swing?"
              icon={<ArrowDownIcon />}
              text={[
                `We're excited that you're eager to get started! As it stands, Patients Influence is focused on building a diverse patient community to attract a wide range of clients. This phase should take about three weeks, but with your assistance in inviting others to join, we might get there sooner. To stay updated on our progress and to be part of our journey, do follow us on social media. We're all ears for your feedback, as we believe in growing and evolving together. Let's shape this platform as a partnership!`,
              ]}
            />
            <HelpCollapse
              title="How do campaigns work on Patients Influence?"
              icon={<ArrowDownIcon />}
              text={[
                `We're thrilled you're interested! Here's how the campaign process at Patients Influence is designed with your comfort, needs, and privacy in mind.`,
                `Firstly, a healthcare company will register on our web app and create a campaign order. They'll specify the type of influencer and the target audience they're interested in. This is why we gather details in the verification process — healthcare companies value diversity and authenticity.`,
                `Next, we curate a list of potential influencers (including you!) who align with the company's requirements. When the company approves the list, they send an invitation to the chosen influencers.`,
                `If you receive an invitation, you have the choice to apply or decline, based on whether the campaign aligns with your interests. Should you choose to apply, we then reveal your first name and username to the client. Until this moment, we've maintained your privacy by only sharing anonymized characteristics about you.`,
                `Once this introduction is made, a matching process begins where you and the client converse to establish a mutual fit. This process can be stopped at any point by either party if the fit doesn't feel right.`,
                `Once you and the client agree to proceed, the campaign begins! You'll create a social media post, upload it, and paste the link into our web app for the client to approve. If you ever feel uncomfortable during this process, you can "ping a moderator" in the chat. Our role is to protect and support you.`,
                `After the campaign is successfully completed and your post is approved by the client, you receive the amount you set for the campaign. Our process is designed to empower you while prioritizing your privacy and well-being. That's the Patients Influence commitment.`,
              ]}
            />
            <HelpCollapse
              title="How does the survey participation process work at Patients Influence?"
              icon={<ArrowDownIcon />}
              text={[
                `We're glad you asked! Our survey process is designed with utmost respect for your comfort, needs, and privacy. Here's a quick walk-through:`,
                `Everything starts with a healthcare company seeking inputs for a product or service. They outline the characteristics of the survey participants they're interested in. Our admin team then uses this information to identify the best suited participants from our influencer pool.`,
                `If you fit the bill, you'll receive an invitation detailing the survey's information. You're always in control - it's entirely up to you whether to accept or decline the invite based on the survey details.`,
                `If you choose to participate, you'll answer a series of questions, each carrying a 'Question Credit' based on its complexity. For instance, an open-ended question is worth more credits due to the thought and time it involves.`,
                `After the survey is completed, your answers are shared with the client. However, we ensure total anonymity. The client never learns the identities of the survey participants — it's part of our commitment to protect your privacy.`,
                `And, when the process concludes, you receive the reward amount you've set for the completed survey. It's all about recognizing the value of your time and inputs.`,
              ]}
            />
            <HelpCollapse
              title="Do healthcare companies have access to my profile without my knowledge?"
              icon={<ArrowDownIcon />}
              text={[
                `Absolutely not! At Patients Influence, your safety and privacy are our treasured commitments. We're here to bring healthcare companies and patient influencers together, but not at the expense of your privacy.`,
                `Your profile is your personal space, and it remains unseen by any healthcare company. Clients are never privy to your images, profile, or personal information. The only occasion when your identity - in the form of your first name, username, and social media platform - is shared with a client is when you choose to apply for a campaign. And remember, that decision is entirely under your control.`,
                `Furthermore, we've built a secure environment for your data. We use advanced AES 256 encryption and store all data safely on AWS. Your information is safe and sound with us. We are here to create a safe, nurturing space where you feel valued, protected, and respected.`,
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
                  placeholder="Please Select"
                  value={helpFormData.topic}
                  onValue={(topic) =>
                    setHelpFormData({ ...helpFormData, topic })
                  }
                  options={topicOptions}
                />
                <Input
                  type="text"
                  label="Subject"
                  placeholder="Please Enter"
                  value={helpFormData.subject}
                  onValue={(subject) =>
                    setHelpFormData({ ...helpFormData, subject })
                  }
                />
                <Input
                  type="text"
                  label="Message"
                  placeholder="Please Enter"
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
              <HelpPageIconWithTextIContainer>
                <h2>Get in touch</h2>
                <Stack>
                  <IconWithText
                    icon={<PhoneCallIcon />}
                    link="https://calendly.com/patientsinfluence-influencer/15min"
                    title="Talk with our founder"
                    text={['Schedule a call!']}
                  />
                  <IconWithText
                    icon={<EnvelopeIcon />}
                    link="mailto:ivan@patientsinfluence.com"
                    title="Write to our founder"
                    text={['Send an email!']}
                  />
                  <IconWithText
                    icon={<LocationIcon />}
                    title="Visit Us"
                    text={['Riehenring 65, 4058 Basel Switzerland']}
                    link="https://goo.gl/maps/mbiouV7WZoXBwqJDA"
                  />
                </Stack>
              </HelpPageIconWithTextIContainer>
            </HelpPageContactContainer>
          </HelpPageContact>
        )}
      </Stack>
    </HelpPageMain>
  );
};

export default HelpPage;
