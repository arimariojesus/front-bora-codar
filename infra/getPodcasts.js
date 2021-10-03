import puppeteer, { Browser, Page } from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
import slugify from 'slugify';

export async function getOptions() {
  const isDev = !process.env.AWS_REGION;
  let options;

  const chromeExecPaths = {
    win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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

function invertArray(arr = []) {
  return arr.reduce((acc, curr) => [curr, ...acc], []);
}

export async function getPodcastInfos(podcastsFromDatabase = []) {
  const baseURL = `https://anchor.fm/codar-app/episodes/11-Trade-do-Cientista-de-Dados-eu7qtc`;
  const browser = await getBrowser();
  const page = await getPage();
  await page.goto(baseURL);
  let hasNewEpisode = false;

  const linkList = await page.evaluate(() => {
    const anchors = [];
    
    document.querySelectorAll('.styles__episodeFeed___3mOKz > div a:first-of-type').forEach(a => {
      anchors.push(a.href);
    });

    return anchors;
  });

  const podcastList = await page.evaluate(() => {
    const podcasts = [];

    document.querySelectorAll('.styles__episodeFeed___3mOKz > div').forEach(async div => {
      document.querySelector('.styles__expander___1NNVb.styles__expander--dark___3Qxhe > div > div').click();

      const thumbnail = div.querySelector('.styles__episodeImage___tMifW > img').getAttribute('src');
      const title = div.querySelector('.styles__episodeHeading___29q7v > div').textContent;
      const description = div.querySelector('.styles__episodeDescription___C3oZg > div').innerHTML.toString();
      const publishedAt = div.querySelector('.styles__episodeCreated___1zP5p').textContent;
      
      const podcastObj = {
        file: {
          url: '',
          duration: 0,
        },
        thumbnail,
        title,
        slug: '',
        description,
        published_at: publishedAt,
      };

      podcasts.push(podcastObj);
    });

    return podcasts;
  });

  // Verifica se há novos episódios
  const lastEpisodeTitle = podcastList[0].title;
  if (podcastsFromDatabase.length > 1) {
    hasNewEpisode = podcastsFromDatabase?.find(item => item.title === lastEpisodeTitle) ? false : true;
  }else {
    hasNewEpisode = true;
  }

  if (hasNewEpisode) {
    const invertedLinkList = invertArray(linkList);
    const invertedPodcastList = invertArray(podcastList);
    let indexOfLastEpisode = 0;

    if (podcastsFromDatabase.length > 1) {
      const lastEpisodeTitleFromDatabase = podcastsFromDatabase[podcastsFromDatabase.length - 1].title;
      indexOfLastEpisode = invertedPodcastList.findIndex(item => item.title === lastEpisodeTitleFromDatabase) + 1;
    }

    const promisesOfTheLinks = await invertedLinkList.slice(indexOfLastEpisode).map(async link => {
      const newPage = await browser.newPage();
      await newPage.goto(link, {
        waitUntil: 'load',
        timeout: 0,
      });
      const audioData = await newPage.evaluate(async () => {
        const audioElement = document.getElementsByTagName('audio')[0];
        const isPlaying = 
          audioElement.currentTime > 0 &&
          !audioElement.paused &&
          !audioElement.ended &&
          audioElement.readyState > audioElement.HAVE_CURRENT_DATA;
  
        if (!isPlaying) {
          await audioElement.play();
        }
  
        const src = audioElement.src;
        let duration;
  
        do {
          duration = audioElement.duration;
        } while(!audioElement.duration && audioElement);
  
        return {
          src,
          duration,
        };
      });
  
      await newPage.close();
  
      return audioData;
    });
  
    const audios = await Promise.allSettled(promisesOfTheLinks);
  
    const data = invertedPodcastList.slice(indexOfLastEpisode).map((item, index) => {
      const podcast = item;
      const hasValue = Object.keys(audios[index]).includes('value');
      podcast.file.url = hasValue ? audios[index].value.src : null;
      podcast.file.duration = hasValue ? audios[index].value.duration : null;
      podcast.slug = slugify(podcast.title, { lower: true, strict: true });
  
      return podcast;
    });
  
    await page.close();
    await browser.close();

    return { data, hasNewEpisode };
  } else {
    await page.close();
    await browser.close();

    return { data: podcastsFromDatabase, hasNewEpisode };
  }
}