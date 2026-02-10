import { FC, useEffect, useState } from "react"
import AliceCarousel from "react-alice-carousel"
import { IConfigurationItem, IFamiliesCard } from "../../Types"
import { useConfigurationItemsContext } from "../Context"
import { assignQuantitiesAndSort, getFamilies } from "../../hooks/utils"
import 'react-alice-carousel/lib/alice-carousel.css';
import "../../../../assets/sass/components/InventoryFilter/cardsFamily.scss"
import { FamilyCard } from "./FamilyCard"

type ComponentProps = {
    loadingListCI: boolean,
    configurationItems: IConfigurationItem[]
}

const CardsContainer: FC<ComponentProps> = ({ loadingListCI, configurationItems }) => {

    const { monitorOptionsHook } = useConfigurationItemsContext()
    const [categoriesComponents, setCategoriesComponents] = useState<Array<any>>()

    useEffect(() => {
        const families: IFamiliesCard[] = getFamilies(monitorOptionsHook.familyData)
        assignQuantitiesAndSort(configurationItems, families)

        const categoriesCards = families?.map((family, index) => {
            return (
                <FamilyCard key={index} family={family} loadingListCI={loadingListCI} />
            )
        })
        setCategoriesComponents(categoriesCards)

    }, [monitorOptionsHook.familyData, configurationItems, loadingListCI])

    return (
        <div className="px-5">
            {monitorOptionsHook.familyLoading ?
                <div className="categories-skeleton placeholder-glow">
                    <div className="placeholder bg-secondary"></div>
                    <div className="placeholder bg-secondary"></div>
                    <div className="placeholder bg-secondary"></div>
                    <div className="placeholder bg-secondary"></div>
                    <div className="placeholder bg-secondary"></div>
                    <div className="placeholder bg-secondary"></div>
                    <div className="placeholder bg-secondary"></div>
                    <div className="placeholder bg-secondary"></div>
                </div> :
                <AliceCarousel
                    responsive={responsive}
                    mouseTracking
                    items={categoriesComponents}
                    disableButtonsControls
                    disableDotsControls
                />
            }
        </div>

    )
}

export { CardsContainer }

const responsive = {
    0: {
        items: 1
    },
    568: {
        items: 3
    },
    800: {
        items: 4
    },
    1024: {
        items: 4,
        itemsFit: 'contain'
    },
    1400: {
        items: 6,
        itemsFit: 'contain'
    },
    1500: {
        items: 6,
        itemsFit: 'contain'
    },
    1520: {
        items: 7,
        itemsFit: 'contain'
    },
    1720: {
        items: 8,
        itemsFit: 'contain'
    },
    1800: {
        items: 9,
        itemsFit: 'contain'
    }
};
