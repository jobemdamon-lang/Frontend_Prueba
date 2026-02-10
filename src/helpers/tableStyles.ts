import { TableStyles } from "react-data-table-component"

export const customStyles = {
  headCells: {
    style: {
      backgroundColor: "RGB(54, 47, 75)",
      color: "RGB(233, 228, 243)",
      fontSize: '15px',
      justifyContent: 'center'
    },
  },
  cells: {
    style: {
      justifyContent: 'center'
    },
  }
}

export const secondCustomStyles = {
  headCells: {
    style: {
      backgroundColor: "RGB(234, 241, 248)",
      color: "#36454F",
      fontSize: '15px',
      justifyContent: 'center'
    },
  },
  cells: {
    style: {
      justifyContent: 'center'
    },
  }
}

export const minimalistStyles:TableStyles = {
  headCells: {
    style: {
      backgroundColor: "#f4f7f8",
      color: "#5b6078",
      fontWeight: '400',
      fontSize: '15px',
      justifyContent: 'center'
    },
  },
  cells: {
    style: {
      justifyContent: 'center',
      color: '#7e8485',
      fontSize: '13px'
    },
  },
  headRow: {
		style: {
			borderBottomWidth: '1px',
			borderBottomColor: '#DDE6ED',
			borderBottomStyle: 'dashed',
		},
		denseStyle: {
			minHeight: '32px',
		},
	},
}

