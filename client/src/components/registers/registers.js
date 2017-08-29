import React, { Component, PropTypes }      from 'react'
import { bindActionCreators }               from 'redux'
import { connect }                          from 'react-redux'
import Select                               from 'react-select'
import moment                               from 'moment'
import { toaster }                          from '../../actions/alerts'
import { actions as subscriptionActions }   from '../../actions/subscriptions'
import { actions as workspaceActions }      from '../../actions/workspaces'
import { index as fetchRegisters }          from '../../actions/registers'
import { destroy as destroyRegister }       from '../../actions/registers'
import { create as createRegister }         from '../../actions/registers'
import RegisterForm                         from './form'
import RegistersList                        from './list'
import RegistersFilter                      from './filter'
import * as utils                           from '../../utils'

const monthsNames = moment.monthsShort()

@connect(
  state => ({
    registers: state.registers.items,
    filter_years: state.registers.years,
    articles: state.articles.items,
    counterparties: state.counterparties.items,
    nextWorkspace: state.workspaces.app.next,
    isCreating: state.registers.isCreating,
    isResolved: {
      articles: state.subscriptions.articles.resolved,
      counterparties: state.subscriptions.counterparties.resolved
    }
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
      ...workspaceActions,
      toaster,
      fetchRegisters,
      createRegister,
      destroyRegister
    }, dispatch),

    isCreatingFunk: (bool) => {
      dispatch({ type: 'REGISTER/IS_CREATING', payload: bool })
    }
  })
)
export default class Registers extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    registers: PropTypes.array.isRequired,
    filter_years: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
    nextWorkspace: PropTypes.object.isRequired,
    isResolved: PropTypes.object.isRequired,
    isCreating: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = this.createInitialState()
    this.subscriptions = ['articles', 'counterparties']

    this.toaster = props.actions.toaster()
    this.handleCreate = this.handleCreate.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
  }

  createInitialState() {
    const date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth()

    return {
      registers: [],
      current: {
        year: year,
        month: month
      },
      filter: {
        years: []
      }
    }
  }

  componentWillMount() {
    const { current } = this.state
    this.props.actions.fetchRegisters(current)
    this.props.actions.subscribe(this.subscriptions)
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
  }

  componentWillReceiveProps(newProps) {
    const isDataReady = this.isModelsFetched(this.subscriptions, newProps)

    if (isDataReady || this.isNextWorkspaceChanged()) {
      this.createRegistersState(newProps)
    }
  }

  isNextWorkspaceChanged() {
    if (this.props.currentWorkspace.id != this.props.nextWorkspace.id) {
      let current = Object.assign({}, this.state.current)

      if (typeof current.month != 'number')
        current.month = monthsNames.indexOf(current.month)

      this.props.actions.fetchRegisters(current)
    }

    return this.props.actions.isNextWorkspaceChanged(this.props.nextWorkspace.id)
  }


  createRegistersState(props = false) {
    if (!props) props = this.props

    let filter = { years: props.filter_years },
        current = Object.assign({}, this.state.current),
        registers = []

    if (typeof current.month != 'number')
      current.month = monthsNames.indexOf(current.month)

    props.registers.forEach((register, i) => {
      const date = new Date(register.date)
      const year = date.getFullYear()
      const month = date.getMonth()

      if (month == current.month && year == current.year)
        registers.push(register)
    })

    Object.assign(current, {
      year: current.year,
      month: monthsNames[current.month]
    })

    this.setState((prevState) => ({
      ...prevState,
      registers,
      current,
      filter
    }))
  }

  handleCreate(register) {
    this.props.isCreatingFunk(true)

    return new Promise((resolve, reject) => {
      this.props.actions.createRegister(register)
        .then(res => {
          this.toaster.success('Register has been created')
          this.props.isCreatingFunk(false)
          resolve(res)
        })
        .catch(err => {
          if (utils.debug) console.error(err)
          this.toaster.error('Could not create register!')
          this.props.isCreatingFunk(false)
          reject(err)
        })
    })
  }

  handleDestroy(id) {
    if (confirm("Are you sure?")) {
      this.props.actions.destroyRegister(id)
        .then(res => {
          this.toaster.success('Register was successfully deleted!')
        })
        .catch(err => {
          if (utils.debug) console.error(err)
          this.toaster.error('Could not delete register!')
        })
    }
  }

  handleFilterChange = field => e => {
    const { value } = e

    this.setState((prevState) => ({
      current: {
        ...prevState.current,
        [field]: value,
      }
    }))

    let current = Object.assign({}, {
      ...this.state.current,
      [field]: value,
    })

    current.month = monthsNames.indexOf(current.month)
    this.props.actions.fetchRegisters(current)
  }

  isModelsFetched(models, inputProps = false) {
    const props = inputProps || this.props
    const { isResolved } = props
    let returnedValue = true

    models.forEach((model, i) => {
      if (!isResolved[model]) {
        returnedValue = false
        return
      }
    })

    return returnedValue
  }

  createRegisterList() {
    const { registers } = this.state
    const { articles, counterparties } = this.props
    const isListDataReady = this.isModelsFetched(this.subscriptions)

    let registerList

    if (isListDataReady) {
      if (registers.length) {
        registerList = (
          <RegistersList
            registers={registers}
            articles={articles}
            counterparties={counterparties}
            handleDestroy={this.handleDestroy}
          />
        )
      } else {
        registerList = (
          <tbody>
            <tr>
              <td rowSpan="6">
                There are no registers...
              </td>
            </tr>
          </tbody>
        )
      }
    } else {
      registerList = (
        <tbody>
          <tr>
            <td colSpan="6">
              <span className="spin-wrap">
                <i class="fa fa-spinner fa-spin fa-2x"></i>
              </span>
            </td>
          </tr>
        </tbody>
      )
    }

    return registerList
  }

  render() {
    const { articles, counterparties, isCreating } = this.props
    const isFormDataReady = this.isModelsFetched(['articles', 'counterparties'])
    const registerList = this.createRegisterList()

    return (
      <div>
        <h3 className="registers-title">
          Registers
        </h3>

        { articles.length ?
          <div className="row">
            <div className="col-md-9">
              <RegistersFilter
                filter={this.state.filter}
                current={this.state.current}
                handleFilterChange={this.handleFilterChange}
              />
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Article</th>
                    <th>Counterparty</th>
                    <th>Value</th>
                    <th>Notes</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                { registerList }
              </table>
            </div>

            { isFormDataReady ?
              <div className="col-md-3">
                <RegisterForm
                  isFetching={isCreating}
                  handleSubmit={this.handleCreate}
                  articles={articles}
                  counterparties={counterparties.filter(counterparty => counterparty.active)}
                />
              </div>
            : null }
          </div>
        :
          <div className='alert alert-info'>
            <span>You must create articles before you can add records to the Register</span>
          </div>
        }
      </div>
    )
  }
}
