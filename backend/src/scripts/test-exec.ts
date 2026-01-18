
export default async function main({ container }) {
    const logger = container.resolve("logger")
    logger.info("✅ Internal Script Running!")

    const regionService = container.resolve("region")
    const regions = await regionService.list()
    logger.info(`Found ${regions.length} regions via Service`)
}
