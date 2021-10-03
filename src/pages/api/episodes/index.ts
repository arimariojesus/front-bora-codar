import { NextApiRequest, NextApiResponse } from 'next';
import { getPodcastInfos } from './../../../../infra/getPodcasts';
import { connectToDatabase } from './../../../utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;
    
    switch (method) {
      case 'GET':
        const { db } = await connectToDatabase();
        const dataFromDatabase = await db.collection('episodes').find().sort({ _id: -1 }).toArray();
        // const { data, hasNewEpisode } = await getPodcastInfos(dataFromDatabase);

        // if (hasNewEpisode) {
        //   await db.collection('episodes').insertMany(data);
        //   dataFromDatabase = await db.collection('episodes').find().toArray();
        // }
        
        res.status(200).json(dataFromDatabase);
        break;
      default:
        res.setHeader('Allow', ['GET']);
        res.status(400).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}