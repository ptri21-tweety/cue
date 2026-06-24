import type { Request, Response, NextFunction } from 'express';
import OpenAI from "openai";
import { buildRecommendationPrompt } from '../prompts/recommendationPrompt.ts'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
}); 

export const  recommendationController = async (req: Request, res:Response, next: NextFunction): Promise<void> => {
    try{
        const retrievedSongs = res.locals.retrievedSongs; 
        const parsedQuery = res.locals.parsedQuery; 
        if(!retrievedSongs || retrievedSongs.length === 0){
            res.status(404).json({ error: 'No matching songs found.' })
            return; 
        }
        const prompt = buildRecommendationPrompt(parsedQuery, retrievedSongs); 

        const response = await openai.responses.create({
            model: 'gpt-5.5',
            input: prompt, 
        });
        
        res.locals.recommendation = response.output_text; 
        next(); 
    } catch (error) {
        next(error); 
    }
};