import { logger } from '@/lib/logger';
import { getUserData } from '../firebase/auth';
import { getExperienceById } from '../firebase/experiences';

export const sendQuestionEmail = async (
  experienceId: string,
  askerName: string,
  questionText: string
) => {
  try {
    const experience = await getExperienceById(experienceId);
    if (!experience || !experience.userId) return;

    const author = await getUserData(experience.userId);
    if (!author || !author.email) return;

    const appUrl = window.location.origin;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Question on LearnTok</h2>
        <p>Hi ${author.displayName || author.username},</p>
        <p><strong>${askerName}</strong> just asked a question on your experience "<strong>${experience.title}</strong>":</p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; font-style: italic;">
          ${questionText}
        </blockquote>
        <p>
          <a href="${appUrl}/experience/${experienceId}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reply to Question
          </a>
        </p>
      </div>
    `;

    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: author.email,
        subject: `New question from ${askerName} on "${experience.title}"`,
        html,
      }),
    });
  } catch (error) {
    logger.error('Failed to send question email', error);
  }
};

export const sendReplyEmail = async (
  experienceId: string,
  askerId: string,
  authorName: string,
  replyText: string
) => {
  try {
    const experience = await getExperienceById(experienceId);
    if (!experience) return;

    const asker = await getUserData(askerId);
    if (!asker || !asker.email) return;

    const appUrl = window.location.origin;

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Reply on LearnTok</h2>
        <p>Hi ${asker.displayName || asker.username},</p>
        <p><strong>${authorName}</strong> just replied to your question on "<strong>${experience.title}</strong>":</p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; font-style: italic;">
          ${replyText}
        </blockquote>
        <p>
          <a href="${appUrl}/experience/${experienceId}" style="display: inline-block; background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Reply
          </a>
        </p>
      </div>
    `;

    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: asker.email,
        subject: `New reply from ${authorName} on "${experience.title}"`,
        html,
      }),
    });
  } catch (error) {
    logger.error('Failed to send reply email', error);
  }
};
