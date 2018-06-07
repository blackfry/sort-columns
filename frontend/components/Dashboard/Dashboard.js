import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import { loadFamilyData } from './DashboardAction';
import { getRoutePath } from 'CommonUtil/CommonUtil.js';
import { ArrowUp, ArrowDown } from '../Global/Shapes';
import styles from './Dashboard.css';


export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sortBy: [
        {
          order: 0,
          stateColName: '',
          asc: false,
          dsc: false
        },
        {
          order: 1,
          stateColName: '',
          asc: false,
          dsc: false
        },
        {
          order: 2,
          stateColName: '',
          asc: false,
          dsc: false
        }
      ]
    };
    this.toggleSortState = this.toggleSortState.bind(this);
    this.handlePrimarySort = this.handlePrimarySort.bind(this);
  }

  componentWillMount() {
    this.props.fetchFamilyData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.data.length !== nextProps.data.length) {
      this.setState({ data: nextProps.data });
    }
  }

  toggleSortState(e, selectedColName) {
    e.preventDefault();
    let sortBy = [...this.state.sortBy];

    // handle set multiple sort criteria on Command click
    if (e.metaKey) {
      if (sortBy[0].stateColName === "") {
        sortBy[0].stateColName = selectedColName
        sortBy[0].asc = true
      }
      if (sortBy[1].stateColName === "" && sortBy[0].stateColName !== selectedColName) {
        sortBy[1].stateColName = selectedColName
        sortBy[1].asc = true
      }
      if (sortBy[2].stateColName === "" && sortBy[0].stateColName !== selectedColName && sortBy[1].stateColName !== selectedColName) {
        sortBy[2].stateColName = selectedColName
        sortBy[2].asc = true
      }
      this.setState({ sortBy });
    } else {

      let primarySort = sortBy.find(item => item.order === 0)
      const { stateColName, asc, dsc } = primarySort;

      // set/reset primary sorting
      if (stateColName !== selectedColName) {
        primarySort = { order: 0, stateColName: selectedColName, asc: true, dsc: false };
        sortBy.splice(0, 1, primarySort)
        sortBy[1] = { order: 1, stateColName: '', asc: false, dsc: false };
        sortBy[2] = { order: 2, stateColName: '', asc: false, dsc: false };
        this.setState({ sortBy });
      }

      // second click on column sort
      if (stateColName === selectedColName && asc) {
        primarySort = { order: 0, stateColName: selectedColName, asc: false, dsc: true };
        sortBy.splice(0, 1, primarySort)
        this.setState({ sortBy });
      }

      // third click on column sort
      if (stateColName === selectedColName && !asc && dsc) {
        primarySort = { order: 0, stateColName: '', asc: false, dsc: false };
        sortBy.splice(0, 1, primarySort)
        this.setState({ sortBy});
      }
    }
    let primarySort = sortBy.find(item => item.order === 0);
    this.handlePrimarySort(primarySort);
  }

  handlePrimarySort(primarySort) {
    const { data } = this.state;
    const { asc, dsc } = primarySort;

    // string sorting helper
    function compare(a, b) {
      const compareA = a[primarySort.stateColName].toUpperCase();
      const compareB = b[primarySort.stateColName].toUpperCase();

      let comparison = 0;
      if (compareA > compareB) {
        comparison = 1;
      } else if (compareA < compareB) {
        comparison = -1;
      }
      let comp = asc ? 1 : -1;
      comp = !asc && !dsc ? 0 : comp;

      return comparison * comp;
    }

    let sortedData = [...data];

    if (primarySort.stateColName !== '') {
      if (primarySort.stateColName === 'score') {
        sortedData = primarySort.asc
          ? sortedData.sort((a, b) => a[primarySort.stateColName] - b[primarySort.stateColName])
          : primarySort.dsc
            ? sortedData.sort((a, b) => b[primarySort.stateColName] - a[primarySort.stateColName])
            : data
      } else {
        sortedData = sortedData.sort(compare)
      }
    } else {
      // third click of column sort sets data back to initially loaded, unsorted data state
      sortedData = this.props.data;
    }
    if (typeof (sortedData) === 'undefined') {
      sortedData = data;
    }
    this.setState({ data: sortedData });
  }

  handleMultipleSort() {
    // ran out of time to implement this..
  }

  renderTable() {
    const { data } = this.state;
    if (data.length < 1) {
      return (
        <tr><td>Sorry there was a problem loading family data, try refreshing the page</td></tr>
      )
    }

    return data.map(item => {
      return (
        <tr key={item.id} className={styles.tableRows}>
        <td className={styles.tableCells}>
          {item.id}
        </td>
        <td className={styles.tableCells}>
          {item.name}
        </td>
        <td className={styles.tableCells}>
          {item.family}
        </td>
        <td className={styles.tableCells}>
          {item.city}
        </td>
        <td className={styles.tableCells}>
          {item.score}
        </td>
      </tr>
      )
    }
  )
  }

  isArrowActive(sortItem, direction, colName) {
    return sortItem.stateColName === colName && sortItem[direction];
  }


  renderHeaderItem() {
    const columnHeaders = ['name', 'family', 'city', 'score'];
    const { sortBy } = this.state;
    const sortItem = sortBy.find(item => item.order === 0);
    return columnHeaders.map((colName, i) => {
      const sortNumber = !sortBy.find(item => item.stateColName === colName) ? null : sortBy.find(item => item.stateColName === colName).order + 1;
      return (
        <th key={i} id={`sort-${colName}`} className={styles.tableHeader} onClick={e => this.toggleSortState(e, colName)}>
          {colName}
          <span className={styles.sortNumber}>{sortNumber}</span>
          <ArrowDown id={`arrow-down-${colName}`} active={this.isArrowActive(sortItem, 'dsc', colName)} />
          <ArrowUp id={`arrow-up-${colName}`} active={this.isArrowActive(sortItem, 'asc', colName)} />
        </th>
      )
    })
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <ButtonToolbar>
          <ButtonGroup>
            <Button onClick={() => this.context.router.push(getRoutePath('sample')) } >Go to sample page</Button>
          </ButtonGroup>
        </ButtonToolbar>
        <p style={{ marginTop: 32 }}>Place your sample below this line (Dashboard/Dashboard.js):</p>
        <h5>Hold Command and click column headers to combine sorting</h5>
        <hr style={{ border: '1px solid black' }} />
        <div>
          <table id="family-table" className={styles.familyTable}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Id</th>
                  {this.renderHeaderItem()};
                </tr>
            </thead>
            <tbody>
              {this.renderTable()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// latest way to dispatch
Dashboard.contextTypes = {
  // @see https://github.com/grommet/grommet/issues/441
  router: PropTypes.object.isRequired
};

Dashboard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    family: PropTypes.string,
    city: PropTypes.string,
    score: PropTypes.number
  }))
}

function mapDispatchToProps(dispatch) {
  return {
    fetchFamilyData: () => dispatch(loadFamilyData())
  };
}

export default connect(
  function ({ family }) {
    return {
      ...family.data
    };
  },
  mapDispatchToProps
)(Dashboard);
