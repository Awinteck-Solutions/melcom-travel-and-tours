import { Request, Response } from "express";
import RecommendedCountry from "../schema/recommended-country.schema";

export class CountriesController {
  // GET RECOMMENDED COUNTRIES LIST
  static async getRecommendedCountries(req: Request, res: Response) {
    try {
      const {
        country,
        continent,
        featured,
        popular,
        page = 1,
        limit = 20,
      } = req.query;

      const filter: any = { status: "ACTIVE" };

      if (country) {
        filter.$or = [
          { name: { $regex: country, $options: "i" } },
          { code: { $regex: country, $options: "i" } },
        ];
      }

      if (continent) filter.continent = continent;
      if (featured !== undefined) filter.featured = featured === "true";
      if (popular !== undefined) filter.popular = popular === "true";

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const countries = await RecommendedCountry.find(filter)
        .sort({ featured: -1, popular: -1, name: 1 })
        .skip(skip)
        .limit(parseInt(limit as string))
        .select(
          "name code image numberOfDestinations continent featured popular"
        );

      const total = await RecommendedCountry.countDocuments(filter);

      return res.status(200).json({
        status: true,
        message: "Recommended countries retrieved successfully",
        data: {
          countries,
          pagination: {
            current: parseInt(page as string),
            total: Math.ceil(total / parseInt(limit as string)),
            count: total,
          },
        },
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve recommended countries",
        error: error,
      });
    }
  }

  // GET RECOMMENDED COUNTRY BY COUNTRY FILTER
  static async getRecommendedCountryByCountry(req: Request, res: Response) {
    try {
      const { country } = req.query;

      if (!country) {
        return res.status(400).json({
          status: false,
          message: "Country parameter is required",
        });
      }

      const countryData = await RecommendedCountry.findOne({
        $or: [
          { name: { $regex: country, $options: "i" } },
          { code: { $regex: country, $options: "i" } },
        ],
        status: "ACTIVE",
      });

      if (!countryData) {
        return res.status(404).json({
          status: false,
          message: "Country not found",
        });
      }

      // Format response according to specification
      const response = {
        image: countryData.image,
        country: countryData.name,
        numberOfDestinations: countryData.numberOfDestinations,
        description: countryData.description,
        continent: countryData.continent,
        currency: countryData.currency,
        language: countryData.language,
        bestTimeToVisit: countryData.bestTimeToVisit,
        averageTemperature: countryData.averageTemperature,
      };

      return res.status(200).json({
        status: true,
        message: "Country information retrieved successfully",
        data: response,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve country information",
        error: error,
      });
    }
  }

  // CREATE RECOMMENDED COUNTRY (Admin only)
  static async createRecommendedCountry(req: Request, res: Response) {
    try {
      const countryData = req.body;

      const country = new RecommendedCountry(countryData);
      const savedCountry = await country.save();

      return res.status(201).json({
        status: true,
        message: "Recommended country created successfully",
        data: savedCountry,
      });
    } catch (error) {
      console.log("error :>> ", error);

      if (error.code === 11000) {
        return res.status(400).json({
          status: false,
          message: "Country name or code already exists",
        });
      }

      return res.status(500).json({
        status: false,
        message: "Failed to create recommended country",
        error: error,
      });
    }
  }

  // UPDATE RECOMMENDED COUNTRY (Admin only)
  static async updateRecommendedCountry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const country = await RecommendedCountry.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!country) {
        return res.status(404).json({
          status: false,
          message: "Recommended country not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Recommended country updated successfully",
        data: country,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to update recommended country",
        error: error,
      });
    }
  }

  // DELETE RECOMMENDED COUNTRY (Admin only)
  static async deleteRecommendedCountry(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const country = await RecommendedCountry.findByIdAndDelete(id);

      if (!country) {
        return res.status(404).json({
          status: false,
          message: "Recommended country not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Recommended country deleted successfully",
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to delete recommended country",
        error: error,
      });
    }
  }

  // GET FEATURED COUNTRIES
  static async getFeaturedCountries(req: Request, res: Response) {
    try {
      const countries = await RecommendedCountry.find({
        status: "ACTIVE",
        featured: true,
      })
        .sort({ name: 1 })
        .select("name code image numberOfDestinations continent");

      return res.status(200).json({
        status: true,
        message: "Featured countries retrieved successfully",
        data: countries,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve featured countries",
        error: error,
      });
    }
  }

  // GET POPULAR COUNTRIES
  static async getPopularCountries(req: Request, res: Response) {
    try {
      const countries = await RecommendedCountry.find({
        status: "ACTIVE",
        popular: true,
      })
        .sort({ numberOfDestinations: -1, name: 1 })
        .select("name code image numberOfDestinations continent");

      return res.status(200).json({
        status: true,
        message: "Popular countries retrieved successfully",
        data: countries,
      });
    } catch (error) {
      console.log("error :>> ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to retrieve popular countries",
        error: error,
      });
    }
  }
}
