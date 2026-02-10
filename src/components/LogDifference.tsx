import { FC, useEffect, useState } from "react"

type ComponentProps = {
  items: string[],
  equalLabel: string,
  diffLabel: string,
  loading?: boolean
}

const LogDifference: FC<ComponentProps> = ({ items, loading, equalLabel, diffLabel }) => {

  const [filteredItems, setFilteredItems] = useState<string[]>(items)

  const handleChangeItems = (criteria: 'all' | 'plus' | 'substract') => () => {
    switch (criteria) {
      case 'all':
        setFilteredItems(items)
        break;
      case 'plus':
        setFilteredItems(items.filter(item => item[0] === "+"))
        break;
      case 'substract':
        setFilteredItems(items.filter(item => item[0] === "-"))
    }
  }

  useEffect(() => { setFilteredItems(items) }, [items])

  return (
    <div className="d-flex bg-dark bg-opacity-75 flex-column">
      <section className="d-flex align-items-center justify-content-end p-2">
        <button
          onClick={handleChangeItems("all")}
          className="btn btn-outline-primary btn-sm"
        >
          Todo
        </button>
        <button
          className="btn btn-outline-success btn-sm"
          onClick={handleChangeItems("plus")}
        >
          {equalLabel}
        </button>
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={handleChangeItems("substract")}
        >
          {diffLabel}
        </button>
      </section>
      <section className="bg-secondary bg-opacity-75 text-center p-2">
        {!loading && filteredItems?.length === 0 && <p className="fw-bold">No existen registros para mostrar.</p>}
        {loading ?
          <p className="fw-bold">Cargando...</p>
          :
          filteredItems?.map((eachDiff, index) => (
            <div className="d-flex align-items-center grow-1">
              <div
                className={`fw-bold w-30px text-center fs-6 p-1
            ${eachDiff[0] === "+" ?
                    "bg-success" :
                    eachDiff[0] === "-" ?
                      "bg-danger" :
                      ""}`}>
                {index + 1}
              </div>
              <div
                className={`w-100 d-flex align-items-center gap-2
              ${eachDiff[0] === "+" ?
                    "bg-success bg-opacity-25" :
                    eachDiff[0] === "-" ?
                      "bg-danger  bg-opacity-25" :
                      ""}`}
              >
                <span
                  className="fw-bold fs-2 w-20px text-center">
                  {eachDiff.substring(0, 1)}
                </span>
                <span>
                  {eachDiff.slice(1)}
                </span>
              </div>
            </div>
          ))
        }
      </section>
    </div>

  )
}
export { LogDifference }