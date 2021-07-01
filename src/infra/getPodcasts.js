import puppeteer, { Browser, Page } from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';

export async function getOptions() {
  const isDev = !process.env.AWS_REGION;
  let options;

  const chromeExecPaths = {
    win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    linux: '/usr/bin/google-chrome',
    darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // Implicit types
    aix: '',
    android: '',
    freebsd: '',
    haiku: '',
    openbsd: '',
    sunos: '',
    cygwin: '',
    netbsd: '',
  };

  const exePath = chromeExecPaths[process.platform];

  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }

  return options;
}

let _browser;
let _page;

async function getBrowser() {
  if (_browser) {
    return _browser;
  }

  const options = await getOptions();
  _browser = await puppeteer.launch(options);

  return _browser;
}

async function getPage() {
  if (_page) {
    return _page;
  }
  const browser = await getBrowser();

  _page = await browser.newPage();

  return _page;
}

// type PodcastType = {
//   file?: {
//     url: string;
//     duration: number;
//   };
//   link?: string;
//   title: string;
//   thumbnail?: string;
//   published_at: string;
//   description: string;
// };

export async function getPodcastInfos() {
  const baseURL = `https://anchor.fm/codar-app/episodes/11-Trade-do-Cientista-de-Dados-eu7qtc`;
  const browser = await getBrowser();
  const page = await getPage();
  await page.goto(baseURL);

  const listLinks = await page.evaluate(() => {
    const anchors = [];
    
    document.querySelectorAll('.styles__episodeFeed___3mOKz > div a:first-of-type').forEach(a => {
      anchors.push(a.href);
    });

    return anchors;
  });

  const podcastsList = await page.evaluate(() => {
    const podcasts = [];

    document.querySelectorAll('.styles__episodeFeed___3mOKz > div').forEach(div => {
      const podcastObj = {
        file: {
          url: '',
          duration: 0,
        },
        thumbnail: div.querySelector('.styles__episodeImage___tMifW > img').getAttribute('src'),
        title: div.querySelector('.styles__episodeHeading___29q7v > div').innerHTML,
        description: div.querySelector('.styles__episodeDescription___C3oZg').innerHTML.toString(),
        published_at: div.querySelector('.styles__episodeCreated___1zP5p').innerHTML.toString(),
      };

      podcasts.push(podcastObj);
    });

    return podcasts;
  });

  const promisesOfTheLinks = await listLinks.map(async (link, index) => {
    const newPage = await browser.newPage();
    await newPage.goto(link);
    const audio = await newPage.evaluate(async () => {
      await document.getElementsByTagName('audio')[0]?.play();
      document.getElementsByTagName('audio')[0].pause();

      return {
        src: document.getElementsByTagName('audio')[0]?.src,
        duration: await document.getElementsByTagName('audio')[0]?.duration,
      };
    });

    await newPage.close();

    return audio;
  });

  const audios = await Promise.allSettled(promisesOfTheLinks);

  const data = podcastsList.map((item, index) => {
    const podcast = item;
    podcast.file.url = audios[index]?.value.src;
    podcast.file.duration = audios[index]?.value.duration;

    return podcast;
  });

  await page.close();
  return data;
}
