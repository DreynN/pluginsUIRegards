/**
 * Copyright 2017-2023 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
 *
 * This file is part of REGARDS.
 *
 * REGARDS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * REGARDS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with REGARDS. If not, see <http://www.gnu.org/licenses/>.
 **/
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'
import map from 'lodash/map'
import { DataManagementShapes } from '@regardsoss/shape'
import AddIcon from 'mdi-material-ui/Plus'
import { i18nContextType } from '@regardsoss/i18n'
import { themeContextType } from '@regardsoss/theme'
import { getFullQualifiedAttributeName } from '@regardsoss/domain/dam'
import { ShowableAtRender } from '@regardsoss/components'
import AttributeSelectorComponent from './AttributeSelectorComponent'

/**
 * Main fem-edit plugin container
 * @author C-S
 */
export class EditComponent extends React.Component {
  static propTypes = {
    // passed as arguments in render()
    attributeModelList: DataManagementShapes.AttributeModelArray,
    entitiesCount: PropTypes.number.isRequired,
  }

  static contextTypes = {
    // enable plugin theme access through this.context
    ...themeContextType,
    // enable i18n access through this.context
    ...i18nContextType,
  }

  static attributeModelToModelAttribute(attributeModelList) {
    const result = {}
    forEach(attributeModelList, (attributeModel, i) => {
      result[i] = {
        content: {
          id: i,
          attribute: {
            ...attributeModel.content,
            // Force optional, as we do not force the user to set a value for each property
            optional: true,
          },
          model: {
            id: -1,
            name: 'Model',
            description: 'Model description',
            type: 'DATA',
          },
        },
        links: attributeModel.links,
      }
    },
    )
    return result
  }

  state = {
    modelAttributeList: {},
  }

  /**
   * Lifecycle hook: create attribute list
   */
  componentDidMount = () => {
    const { attributeModelList } = this.props
    this.computeModelAttributes(attributeModelList)
  }

  /**
   *
   * @param attributeModelList
   */
  computeModelAttributes = (attributeModelList) => {
    if (!isEmpty(attributeModelList)) {
      const modelAttributeList = EditComponent.attributeModelToModelAttribute(attributeModelList)
      this.setState({
        modelAttributeList,
      })
    }
  }


  renderAvailableAttributes = () => {
    const attributeModelList = this.props.attributeModelList
    return this.renderAttributes(attributeModelList, <AddIcon />)
  }


  renderAttributes =(attributeModelList, icon) => (
    map(attributeModelList, (attributeModel) => (
      <AttributeSelectorComponent
        label={getFullQualifiedAttributeName(attributeModel.content)}
        // node to show as filter icon
        icon={icon}
      />
    ))
  )

  render() {
    const { intl: { formatMessage }, moduleTheme } = this.context
    const {
      entitiesCount,
    } = this.props
    const { modelAttributeList } = this.state
    const hasNoAttributes = isEmpty(modelAttributeList)
    return (
      <div style={moduleTheme.body}>
        <div style={moduleTheme.contentWrapper}>
          <div style={moduleTheme.attributesWrapper}>
            <ShowableAtRender>
              {formatMessage({ id: 'plugin.list.editable' }, { nbElement: entitiesCount })}
              <div style={moduleTheme.attributesChipsWrapper}>
                {this.renderAvailableAttributes()}
              </div>
            </ShowableAtRender>
          </div>
          <ShowableAtRender show={hasNoAttributes}>
            <ShowableAtRender show={hasNoAttributes}>
              {formatMessage({ id: 'plugin.error.no.attribute' }, { nbElement: entitiesCount })}
            </ShowableAtRender>
          </ShowableAtRender>
        </div>
      </div>
    )
  }
}

// redux form
export default EditComponent
