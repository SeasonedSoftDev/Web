import { Injectable, Logger } from '@nestjs/common';
import nlp from 'compromise';
import emojiRegex from 'emoji-regex';

@Injectable()
export class NLPService {
  private readonly logger = new Logger(NLPService.name);
  private readonly regexEmoji = emojiRegex();
  private readonly regexHashtag = /#\w+/g;
  private readonly regexMention = /@\w+/g;
  // NLTK's (Natural Language Toolkit) list of English stop words
  readonly stopWords = [
    'i',
    'me',
    'my',
    'myself',
    'we',
    'our',
    'ours',
    'ourselves',
    'you',
    "you're",
    "you've",
    "you'll",
    "you'd",
    'your',
    'yours',
    'yourself',
    'yourselves',
    'he',
    'him',
    'his',
    'himself',
    'she',
    "she's",
    'her',
    'hers',
    'herself',
    'it',
    "it's",
    'its',
    'itself',
    'they',
    'them',
    'their',
    'theirs',
    'themselves',
    'what',
    'which',
    'who',
    'whom',
    'this',
    'that',
    "that'll",
    'these',
    'those',
    'am',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'having',
    'do',
    'does',
    'did',
    'doing',
    'a',
    'an',
    'the',
    'and',
    'but',
    'if',
    'or',
    'because',
    'as',
    'until',
    'while',
    'of',
    'at',
    'by',
    'for',
    'with',
    'about',
    'against',
    'between',
    'into',
    'through',
    'during',
    'before',
    'after',
    'above',
    'below',
    'to',
    'from',
    'up',
    'down',
    'in',
    'out',
    'on',
    'off',
    'over',
    'under',
    'again',
    'further',
    'then',
    'once',
    'here',
    'there',
    'when',
    'where',
    'why',
    'how',
    'all',
    'any',
    'both',
    'each',
    'few',
    'more',
    'most',
    'other',
    'some',
    'such',
    'no',
    'nor',
    'not',
    'only',
    'own',
    'same',
    'so',
    'than',
    'too',
    'very',
    's',
    't',
    'can',
    'will',
    'just',
    'don',
    "don't",
    'should',
    "should've",
    'now',
    'd',
    'll',
    'm',
    'o',
    're',
    've',
    'y',
    'ain',
    'aren',
    "aren't",
    'couldn',
    "couldn't",
    'didn',
    "didn't",
    'doesn',
    "doesn't",
    'hadn',
    "hadn't",
    'hasn',
    "hasn't",
    'haven',
    "haven't",
    'isn',
    "isn't",
    'ma',
    'mightn',
    "mightn't",
    'mustn',
    "mustn't",
    'needn',
    "needn't",
    'shan',
    "shan't",
    'shouldn',
    "shouldn't",
    'wasn',
    "wasn't",
    'weren',
    "weren't",
    'won',
    "won't",
    'wouldn',
    "wouldn't",
  ];

  private extractEmojis(text: string) {
    const emojis = [...text.matchAll(this.regexEmoji)].map((match) => match[0]);

    return emojis;
  }

  private extractHashtags(text: string) {
    const hashtags = [...text.matchAll(this.regexHashtag)].map(
      (match) => match[0],
    );

    return hashtags;
  }

  private extractMentions(text: string) {
    const mentions = [...text.matchAll(this.regexMention)].map(
      (match) => match[0],
    );

    return mentions;
  }

  private stripText(text: string) {
    return text
      .replace(this.regexEmoji, '')
      .replace(this.regexHashtag, '')
      .trim();
  }

  processText(text: string) {
    //#region FILTER "ROGUE" TOKENS
    // extract emojis
    const emojis = this.extractEmojis(text);

    // extract hashtags
    const hashtags = this.extractHashtags(text);

    // extract mentions
    const mentions = this.extractMentions(text);

    // strip out emojis and hashtags
    let strippedText = this.stripText(text);

    // remove punctuation
    // strippedText = strippedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    strippedText = strippedText.replace(
      // /[.,\/#!$%\^&\*;:{}=\-_`~()]/g
      // /[.,?!'";:\-_/\\|~`@#$%^&*(){}\[\]<>+=]/g,
      /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g,
      '',
    );
    //#endregion

    const doc = nlp(strippedText);

    // convert to lowercase
    doc.toLowerCase();

    // normalize the verbs
    doc.verbs().toInfinitive();

    // remove stop words
    this.stopWords.forEach((word) => {
      doc.remove(`\\b${word}\\b`); // only whole words are removed
    });

    // return doc.out('text');
    // return doc.text();

    // remove excess whitespace characters
    const processedText = doc.text().trim().replace(/\s+/g, ' ');

    return {
      strippedText: processedText,
      emojis,
      hashtags,
      mentions,
    };
  }
}
