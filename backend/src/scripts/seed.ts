import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: any) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_locales: [
          {
            locale_code: "fr-FR"
          },
          {
            locale_code: "es-ES"
          }
        ]
      },
    },
  });
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "eur",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
        {
          currency_code: "inr",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const regionModuleService = container.resolve(Modules.REGION);
  const existingRegions = await regionModuleService.listRegions();

  let region = existingRegions.find((r: any) => r.name === "Europe");
  let indiaRegion = existingRegions.find((r: any) => r.name === "India");

  const regionsToCreate: any[] = [];

  if (!region) {
    regionsToCreate.push({
      name: "Europe",
      currency_code: "eur",
      countries,
      payment_providers: ["pp_system_default"],
    });
  }

  if (!indiaRegion) {
    regionsToCreate.push({
      name: "India",
      currency_code: "inr",
      countries: ["in"],
      payment_providers: ["pp_system_default"],
    });
  }

  if (regionsToCreate.length > 0) {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: regionsToCreate,
      },
    });

    if (!region) region = regionResult.find((r: any) => r.name === "Europe");
    if (!indiaRegion) indiaRegion = regionResult.find((r: any) => r.name === "India");
  }

  // Create variables if not created/tound to avoid null errors later (though they should be found now)
  if (!region) region = existingRegions[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  const taxModuleService = container.resolve(Modules.TAX);
  const existingTaxRegions = await taxModuleService.listTaxRegions();
  const existingTaxCountryCodes = new Set(existingTaxRegions.map((tr: any) => tr.country_code));
  const taxRegionsToCreate = [...countries, "in"]
    .filter(cc => !existingTaxCountryCodes.has(cc))
    .map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    }));

  if (taxRegionsToCreate.length > 0) {
    await createTaxRegionsWorkflow(container).run({
      input: taxRegionsToCreate,
    });
  }
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  let stockLocation;
  try {
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "European Warehouse",
            address: {
              city: "Copenhagen",
              country_code: "DK",
              address_1: "",
            },
          },
        ],
      },
    });
    stockLocation = stockLocationResult[0];
  } catch (e) {
    const stockLocationService = container.resolve(Modules.STOCK_LOCATION);
    const [existing] = await stockLocationService.listStockLocations({ name: "European Warehouse" });
    stockLocation = existing;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  let fulfillmentSet;
  try {
    fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: [
            { country_code: "gb", type: "country" },
            { country_code: "de", type: "country" },
            { country_code: "dk", type: "country" },
            { country_code: "se", type: "country" },
            { country_code: "fr", type: "country" },
            { country_code: "es", type: "country" },
            { country_code: "it", type: "country" },
          ],
        },
        {
          name: "India",
          geo_zones: [
            { country_code: "in", type: "country" },
          ],
        },
      ],
    });
  } catch (e) {
    const sets = await fulfillmentModuleService.listFulfillmentSets({ name: "European Warehouse delivery" });
    fulfillmentSet = sets[0];
  }

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    });
  } catch (e) { }

  try {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            { currency_code: "usd", amount: 1000 },
            { currency_code: "eur", amount: 1000 },
            { region_id: region.id, amount: 1000 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Standard Shipping India",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[1].id, // Index 1 is India
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 3-5 days.",
            code: "standard_in",
          },
          prices: [
            { currency_code: "inr", amount: 50000 }, // 500 INR
            { region_id: indiaRegion.id, amount: 50000 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });
  } catch (e) {
    logger.warn("Shipping options might already exist.");
  }
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  let categoryResult;
  try {
    const { result } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: [
          { name: "Shirts", is_active: true },
          { name: "Sweatshirts", is_active: true },
          { name: "Pants", is_active: true },
          { name: "Merch", is_active: true },
        ],
      },
    });
    categoryResult = result;
  } catch (e) {
    const categoryModuleService = container.resolve(Modules.PRODUCT);
    categoryResult = await categoryModuleService.listProductCategories({
      name: ["Shirts", "Sweatshirts", "Pants", "Merch"]
    });
  }

  try {
    await createProductsWorkflow(container).run({
      input: {
        products: [
          {
            title: "Medusa T-Shirt",
            category_ids: [
              categoryResult.find((cat) => cat.name === "Shirts")!.id,
            ],
            description:
              "Reimagine the feeling of a classic T-shirt. With our cotton T-shirts, everyday essentials no longer have to be ordinary.",
            handle: "t-shirt",
            weight: 400,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png" },
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png" },
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png" },
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png" },
            ],
            options: [
              { title: "Size", values: ["S", "M", "L", "XL"] },
              { title: "Color", values: ["Black", "White"] },
            ],
            variants: [
              {
                title: "S / Black",
                sku: "SHIRT-S-BLACK",
                options: { Size: "S", Color: "Black" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 120000, currency_code: "inr" }, // 1200 INR
                ],
              },
              {
                title: "S / White",
                sku: "SHIRT-S-WHITE",
                options: { Size: "S", Color: "White" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 120000, currency_code: "inr" },
                ],
              },
              {
                title: "M / Black",
                sku: "SHIRT-M-BLACK",
                options: { Size: "M", Color: "Black" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 120000, currency_code: "inr" },
                ],
              },
              {
                title: "M / White",
                sku: "SHIRT-M-WHITE",
                options: { Size: "M", Color: "White" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 120000, currency_code: "inr" },
                ],
              },
              {
                title: "L / Black",
                sku: "SHIRT-L-BLACK",
                options: { Size: "L", Color: "Black" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 120000, currency_code: "inr" },
                ],
              },
              {
                title: "L / White",
                sku: "SHIRT-L-WHITE",
                options: { Size: "L", Color: "White" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 120000, currency_code: "inr" },
                ],
              },
              {
                title: "XL / Black",
                sku: "SHIRT-XL-BLACK",
                options: { Size: "XL", Color: "Black" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 120000, currency_code: "inr" },
                ],
              },
              {
                title: "XL / White",
                sku: "SHIRT-XL-WHITE",
                options: { Size: "XL", Color: "White" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 120000, currency_code: "inr" },
                ],
              },
            ],
            sales_channels: [{ id: defaultSalesChannel[0].id }],
          },
          {
            title: "Medusa Sweatshirt",
            category_ids: [
              categoryResult.find((cat) => cat.name === "Sweatshirts")!.id,
            ],
            description:
              "Reimagine the feeling of a classic sweatshirt. With our cotton sweatshirt, everyday essentials no longer have to be ordinary.",
            handle: "sweatshirt",
            weight: 400,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png" },
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png" },
            ],
            options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
            variants: [
              {
                title: "S",
                sku: "SWEATSHIRT-S",
                options: { Size: "S" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 250000, currency_code: "inr" }, // 2500 INR
                ],
              },
              {
                title: "M",
                sku: "SWEATSHIRT-M",
                options: { Size: "M" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 250000, currency_code: "inr" },
                ],
              },
              {
                title: "L",
                sku: "SWEATSHIRT-L",
                options: { Size: "L" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 250000, currency_code: "inr" },
                ],
              },
              {
                title: "XL",
                sku: "SWEATSHIRT-XL",
                options: { Size: "XL" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 250000, currency_code: "inr" },
                ],
              },
            ],
            sales_channels: [{ id: defaultSalesChannel[0].id }],
          },
          {
            title: "Medusa Sweatpants",
            category_ids: [
              categoryResult.find((cat) => cat.name === "Pants")!.id,
            ],
            description:
              "Reimagine the feeling of classic sweatpants. With our cotton sweatpants, everyday essentials no longer have to be ordinary.",
            handle: "sweatpants",
            weight: 400,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png" },
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png" },
            ],
            options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
            variants: [
              {
                title: "S",
                sku: "SWEATPANTS-S",
                options: { Size: "S" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 200000, currency_code: "inr" }, // 2000 INR
                ],
              },
              {
                title: "M",
                sku: "SWEATPANTS-M",
                options: { Size: "M" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 200000, currency_code: "inr" },
                ],
              },
              {
                title: "L",
                sku: "SWEATPANTS-L",
                options: { Size: "L" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 200000, currency_code: "inr" },
                ],
              },
              {
                title: "XL",
                sku: "SWEATPANTS-XL",
                options: { Size: "XL" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 200000, currency_code: "inr" },
                ],
              },
            ],
            sales_channels: [{ id: defaultSalesChannel[0].id }],
          },
          {
            title: "Medusa Shorts",
            category_ids: [
              categoryResult.find((cat) => cat.name === "Merch")!.id,
            ],
            description:
              "Reimagine the feeling of classic shorts. With our cotton shorts, everyday essentials no longer have to be ordinary.",
            handle: "shorts",
            weight: 400,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            images: [
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png" },
              { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png" },
            ],
            options: [{ title: "Size", values: ["S", "M", "L", "XL"] }],
            variants: [
              {
                title: "S",
                sku: "SHORTS-S",
                options: { Size: "S" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 150000, currency_code: "inr" }, // 1500 INR
                ],
              },
              {
                title: "M",
                sku: "SHORTS-M",
                options: { Size: "M" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 150000, currency_code: "inr" },
                ],
              },
              {
                title: "L",
                sku: "SHORTS-L",
                options: { Size: "L" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 150000, currency_code: "inr" },
                ],
              },
              {
                title: "XL",
                sku: "SHORTS-XL",
                options: { Size: "XL" },
                prices: [
                  { amount: 1000, currency_code: "eur" },
                  { amount: 1500, currency_code: "usd" },
                  { amount: 150000, currency_code: "inr" },
                ],
              },
            ],
            sales_channels: [{ id: defaultSalesChannel[0].id }],
          },
        ],
      },
    });
  } catch (e) {
    logger.warn("Skipping product creation because it likely failed on duplicate handles. Ensure INR prices are set manually if needed.");
  }
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
