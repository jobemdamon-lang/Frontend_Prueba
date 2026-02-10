import { FC } from "react"
import { IFamiliesCard } from "../../Types"

type ComponentProps = {
    family: IFamiliesCard,
    loadingListCI: boolean
}

const FamilyCard: FC<ComponentProps> = ({ family, loadingListCI }) => {

    //const cardName = family.title.split(" ").join("")

    return (
        <div className="c-dashboardInfo">
            <div className="wrap">
                <span className="hind-font caption-12 c-dashboardInfo__count">
                    {family.quantity}
                </span>
                <h4 className="heading heading5 hind-font medium-font-weight c-dashboardInfo__title">
                    {family.title}
                </h4>
            </div>
        </div>
    )
}
export { FamilyCard }