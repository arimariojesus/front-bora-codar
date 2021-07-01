import { NextApiResponse } from "next";
import { getPodcastInfos } from "../../infra/getPodcasts";

export default async function handler(req: NextApiResponse, res: NextApiResponse) {
  const audios = await getPodcastInfos();
  res.status(200).json({ data: audios });
}
