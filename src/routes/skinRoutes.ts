import { Router, Request, Response } from 'express';
import { aggregatePrices } from '../services/aggregator';
import { ApiSuccessResponse, ApiErrorResponse } from '../types';

const router = Router();

router.get('/skins/:skinName', async (req: Request, res: Response) => {
  try {
    const skinName = decodeURIComponent(req.params.skinName);
    const withVariantParam = req.query.with_variant as string;
    const withVariant = withVariantParam === '1';

    if (!skinName || skinName.trim() === '') {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Skin name is required',
          details: 'Please provide a valid skin name',
        },
      };
      return res.status(400).json(errorResponse);
    }

    const aggregatedData = await aggregatePrices(skinName, withVariant);

    const successResponse: ApiSuccessResponse = {
      success: true,
      data: aggregatedData,
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while processing your request',
        details: errorMessage,
      },
    };
    return res.status(500).json(errorResponse);
  }
});

export default router;
