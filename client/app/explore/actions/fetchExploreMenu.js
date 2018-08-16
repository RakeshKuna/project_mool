/**
 * Created by venkatsrinag on 11/7/17.
 */
import gql from 'graphql-tag'
import _ from 'lodash'

export async function fetchExploreMenuHandler(connector){
  const result = await connector.query({
    query: gql`
      fragment subMenu on Menu{
                  uniqueId
                  isLink
                  isMenu
                  isDisabled
                  name
                  image
                  link
                  dynamicLink
                  subMenuMappingId
                  subMenusId
                  hideSubMenu
                  showInBreadCrum
              }

              query LeftNavQuery($name: String!) {
                data:fetchExploreMenu(name: $name){
                    name
                    menu{
                      ...subMenu
                         subMenu{
                          ...subMenu
                            subMenu{
                              ...subMenu
                                  subMenu{
                                     ...subMenu
                                         }
                                   }
                              }
                           }
                    }
      }
    `,
    variables: {name:'mlExploreMenu'},
    fetchPolicy: 'network-only'
  })

  const menu = result.data.data.menu;
  return menu;
}
