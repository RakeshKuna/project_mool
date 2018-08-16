/**
 * Created by venkatsrinag on 19/5/17.
 */
if (Meteor.isServer) {
  MlMenus.upsert({name: "mlSubChapterAdminNonMoolya"}, {
    $set: {
      "name": "mlSubChapterAdminNonMoolya",
      "menu": [
        {
          "image": "ml my-ml-dashboard",
          "link": "/admin/dashboard/chapters",
          "name": "Ecosystem",
          "uniqueId": "dashboard",
          "isLink": true,
          "isMenu": true,
          "subMenu": [
            {
              "link": "",
              "name": "Clusters",
              "uniqueId": "dashboard_clusters",
              "subMenuMappingId": "dashboard_clusters",
              "subMenusId": "dashboard",
              "isLink": false,
              "isMenu": false,
              "isDisabled": true,
              "image": ""
            },
            {
              "link": "/admin/dashboard/chapters",
              "name": "Chapters",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "uniqueId": "dashboard_chapters",
              "subMenuMappingId": "dashboard_chapters",
              "subMenusId": "dashboard",
              "isLink": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/dashboard/clusters",
                  "name": "SpecChapters",
                  "uniqueId": "dashboard_specChapters",
                  "subMenuMappingId": "dashboard_chapters",
                  "subMenusId": "dashboard",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""

                },
                {
                  "link": "/admin/dashboard/clusters",
                  "name": "SpecSubChapters",
                  "uniqueId": "dashboard_specSubChapters",
                  "subMenuMappingId": "dashboard_chapters",
                  "subMenusId": "dashboard",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenu": [
                    {
                      "link": "/admin/dashboard/anchorDetails",
                      "name": "Anchor Details",
                      "uniqueId": "dashboard_specSubChapters_anchorInfoView",
                      "isLink": true,
                      "isMenu": false,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "dashboard",
                      "subMenuMappingId": "dashboard_chapters"
                    }
                  ]
                }]
            },
            {
              "link": "/admin/dashboard/communities",
              "name": "Communities",
              "uniqueId": "dashboard_communities",
              "subMenuMappingId": "dashboard_communities",
              "subMenusId": "dashboard",
              "isLink": true,
              "image": ""
            },
          ]
        },
        {
          "image": "ml my-ml-cluster",
          "link": "",
          "name": "Cluster",
          "uniqueId": "cluster",
          "isLink": true,
          "isMenu": true,
        },
        {
          "image": "ml my-ml-chapter",
          "link": "/admin/chapters",
          "uniqueId": "chapter",
          "name": "Chapter",
          "isLink": true,
          "isMenu": true,
          "hideSubMenu": true,
          "subMenu": [
            {
              "link": "/admin/chapters",
              "name": "Chapters",
              "uniqueId": "chapter_chapters",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "hideSubMenu": true,
              "dynamicLinkHandler": "",
              "subMenusId": "chapter",
              "subMenuMappingId": "chapter_chapters",
              "subMenu": [
                {
                  "link": "/admin/chapters/subChapters/subChapterDetails",
                  "name": "SubChapterDetails",
                  "uniqueId": "chapter_subChapterDetails",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "chapter_chapters",
                  "subMenuMappingId": "chapter_subChapterDetails"
                },
                {
                  "link": "/admin/chapters/subChapters/communities",
                  "name": "Communities",
                  "uniqueId": "chapter_communities",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "chapter_chapters",
                  "subMenuMappingId": "chapter_communities",
                  "subMenu": [
                    {
                      "link": "/admin/chapters/subChapters/communities/communityDetails",
                      "name": "Community Details",
                      "uniqueId": "chapter_communities_communityDetails",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "chapter_communities",
                      "subMenuMappingId": "chapter_communities_communityDetails"
                    },
                    {
                      "link": "/admin/chapters/subChapters/communities/assignusers",
                      "name": "Backend Users",
                      "uniqueId": "chapter_communities_assignusers",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "chapter_communities",
                      "subMenuMappingId": "chapter_communities_assignusers"
                    },
                  ]
                },
                {
                  "link": "/admin/chapters/assignusers",
                  "name": "Backend Users",
                  "uniqueId": "chapter_assignusers",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "chapter_chapters",
                  "subMenuMappingId": "chapter_assignusers"
                },
                {
                  "link": "/admin/chapters/history",
                  "name": "History",
                  "uniqueId": "chapter_history",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "chapter_chapters",
                  "subMenuMappingId": "chapter_history"
                }
              ]
            },
            {
              "link" : "/admin/chapters/subChapters",
              "name": "Sub Chapters",
              "uniqueId": "chapter_subChapters",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "hideSubMenu": true,
              "dynamicLinkHandler": "",
              "subMenusId": "chapter",
              "subMenuMappingId":"chapter_subChapters"
            }
          ]
        },
        {
          "image": "ml my-ml-community",
          "link": "/admin/communities",
          "uniqueId": "community",
          "name": "Community",
          "isLink": true,
          "isMenu": true,
          "hideSubMenu": true,
          "subMenu": [
            {
              "link": "/admin/community/chapter",
              "name": "Chapter",
              "uniqueId": "communities_chapters",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "subMenusId": "community",
              "hideSubMenu": true,
              "subMenuMappingId": "communities_chapters",
              "subMenu": [
                {
                  "link": "/admin/community/chapter/subChapter",
                  "name": "Sub Chapter",
                  "uniqueId": "communities_subChapters",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "communities_chapters",
                  "hideSubMenu": true,
                  "subMenuMappingId": "communities_subChapters",
                  "subMenu":[
                    {
                      "link": "/admin/community/chapter/subChapter/community",
                      "name": "Community",
                      "uniqueId": "communities_communities",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "hideSubMenu": true,
                      "subMenusId": "communities_subChapters",
                      "subMenuMappingId": "communities_communities",
                      "subMenu": [
                        {
                          "link": "/admin/community/subChapter/community/communityDetails",
                          "name": "Community Details",
                          "uniqueId": "communities_subChapters_communityDetails",
                          "isLink": true,
                          "isMenu": true,
                          "image": "",
                          "dynamicLink": true,
                          "dynamicLinkHandler": "",
                          "subMenusId": "communities_communities",
                          "subMenuMappingId": "communities_subChapters_communityDetails",
                        },
                        {
                          "link": "/admin/community/subChapter/community/assignuser",
                          "name": "Backend User",
                          "uniqueId": "communities_subChapters_assignUsers",
                          "isLink": true,
                          "isMenu": true,
                          "image": "",
                          "dynamicLink": true,
                          "dynamicLinkHandler": "",
                          "subMenusId": "communities_communities",
                          "subMenuMappingId": "communities_subChapters_assignUsers",
                        },
                        {
                          "link": "/admin/community/history",
                          "name": "History",
                          "uniqueId": "community_subChapter_History_Details",
                          "isLink": true,
                          "isMenu": true,
                          "image": "",
                          "dynamicLink": true,
                          "dynamicLinkHandler": "",
                          "subMenusId": "communities_communities",
                          "subMenuMappingId": "community_subChapter_History_Details"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        /**
         * admin left nav users routes
         */
        {
          "image": "ml my-ml-users",
          "link": "/admin/users/clusters",
          "name": "Users",
          "uniqueId": "users",
          "isLink": true,
          "isMenu": true,
          "subMenu": [
            {
              "link" : "/admin/users/clusters",
              "name" : "Cluster",
              "uniqueId" : "users_cluster",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "dynamicLink" : true,
              "dynamicLinkHandler" : "",
              "subMenusId" : "users",
              "subMenuMappingId" : "users_cluster",
              "subMenu" : [
                {
                  "link" : "/admin/users/aboutuser",
                  "name" : "About",
                  "uniqueId" : "users_about",
                  "isLink" : true,
                  "isMenu" : true,
                  "image" : "",
                  "dynamicLink" : true,
                  "dynamicLinkHandler" : "",
                  "subMenusId" : "users_cluster",
                  "subMenuMappingId" : "users_about"
                },
                {
                  "link" : "/admin/users/addressBook",
                  "name" : "Address Book",
                  "uniqueId" : "users_addressBook",
                  "isLink" : true,
                  "isMenu" : true,
                  "image" : "",
                  "dynamicLink" : true,
                  "dynamicLinkHandler" : "",
                  "subMenusId" : "users_cluster",
                  "subMenuMappingId" : "users_addressBook"
                },
                {
                  "link": "/admin/users/portfolio",
                  "name": "Portfolio",
                  "uniqueId": "users_portfolio",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "users_cluster",
                  "subMenuMappingId": "users_portfolio"
                },
                {
                  "link" : "/admin/users/connections",
                  "name" : "Connections",
                  "uniqueId" : "users_connections",
                  "isLink" : true,
                  "isMenu" : true,
                  "image" : "",
                  "dynamicLink" : true,
                  "dynamicLinkHandler" : "",
                  "subMenusId" : "users_cluster",
                  "subMenuMappingId" : "users_connections"

                  /**moving the static menus to the tabs*/

                  // "subMenu" : [
                  //   {
                  //     "link" : "/admin/users/connections/ideator",
                  //     "name" : "Ideator",
                  //     "uniqueId" : "users_connectionsIdeator",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_connectionsIdeator",
                  //     "subMenusId" : "users_connections"
                  //   },
                  //   {
                  //     "link" : "/admin/users/connections/startup",
                  //     "name" : "Startup",
                  //     "uniqueId" : "users_connectionsStartup",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_connectionsStartup",
                  //     "subMenusId" : "users_connections"
                  //   },
                  //   {
                  //     "link" : "/admin/users/connections/investor",
                  //     "name" : "Investor",
                  //     "uniqueId" : "users_connectionsinvestor",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_connectionsInvestor",
                  //     "subMenusId" : "users_connections"
                  //   },
                  //   {
                  //     "link" : "/admin/users/connections/serviceProvider",
                  //     "name" : "Service Provider",
                  //     "uniqueId" : "users_connectionsServiceProvider",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_connectionsServiceProvider",
                  //     "subMenusId" : "users_connections"
                  //   },
                  //   {
                  //     "link" : "/admin/users/connections/company",
                  //     "name" : "Company",
                  //     "uniqueId" : "users_connectionsCompany",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_connectionsCompany",
                  //     "subMenusId" : "users_connections"
                  //   },
                  //   {
                  //     "link" : "/admin/users/connections/institution",
                  //     "name" : "Institution",
                  //     "uniqueId" : "users_connectionsInstitution",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_connectionsInstitution",
                  //     "subMenusId" : "users_connections"
                  //   }
                  // ]
                },
                {
                  "link" : "/admin/users/favourites",
                  "name" : "Favourites",
                  "uniqueId" : "users_favourites",
                  "isLink" : true,
                  "isMenu" : true,
                  "image" : "",
                  "dynamicLink" : true,
                  "dynamicLinkHandler" : "",
                  "subMenusId" : "users_cluster",
                  "subMenuMappingId" : "users_favourites",

                  // "subMenu" : [
                  //   {
                  //     "link" : "/admin/users/favourites/ideator",
                  //     "name" : "Ideator",
                  //     "uniqueId" : "users_favouritesIdeator",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_favouritesIdeator",
                  //     "subMenusId" : "users_favourites"
                  //   },
                  //   {
                  //     "link" : "/admin/users/favourites/startup",
                  //     "name" : "Startup",
                  //     "uniqueId" : "users_favouritesStartup",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_favouritesStartup",
                  //     "subMenusId" : "users_favourites"
                  //   },
                  //   {
                  //     "link" : "/admin/users/favourites/investor",
                  //     "name" : "Investor",
                  //     "uniqueId" : "users_favouritesinvestor",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_favouritesInvestor",
                  //     "subMenusId" : "users_favourites"
                  //   },
                  //   {
                  //     "link" : "/admin/users/favourites/serviceProvider",
                  //     "name" : "Service Provider",
                  //     "uniqueId" : "users_favouritesServiceProvider",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_favouritesServiceProvider",
                  //     "subMenusId" : "users_favourites"
                  //   },
                  //   {
                  //     "link" : "/admin/users/favourites/company",
                  //     "name" : "Company",
                  //     "uniqueId" : "users_favouritesCompany",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_favouritesCompany",
                  //     "subMenusId" : "users_favourites"
                  //   },
                  //   {
                  //     "link" : "/admin/users/favourites/institution",
                  //     "name" : "Institution",
                  //     "uniqueId" : "users_favouritesInstitution",
                  //     "isLink" : true,
                  //     "isMenu" : true,
                  //     "image" : "",
                  //     "dynamicLink" : true,
                  //     "dynamicLinkHandler" : "",
                  //     "subMenuMappingId" : "users_favouritesInstitution",
                  //     "subMenusId" : "users_favourites"
                  //   }
                  // ]
                },
                // {
                //   "link" : "/admin/users/wishlist/ideator",
                //   "name" : "Wishlist",
                //   "uniqueId" : "users_wishlist",
                //   "isLink" : true,
                //   "isMenu" : true,
                //   "image" : "",
                //   "dynamicLink" : true,
                //   "dynamicLinkHandler" : "",
                //   "subMenusId" : "users_cluster",
                //   "subMenuMappingId" : "users_wishlist",
                //   "subMenu" : [
                //     {
                //       "link" : "/admin/users/wishlist/ideator",
                //       "name" : "Ideator",
                //       "uniqueId" : "users_wishlistIdeator",
                //       "isLink" : true,
                //       "isMenu" : true,
                //       "image" : "",
                //       "dynamicLink" : true,
                //       "dynamicLinkHandler" : "",
                //       "subMenuMappingId" : "users_wishlistIdeator",
                //       "subMenusId" : "users_wishlist"
                //     },
                //     {
                //       "link" : "/admin/users/wishlist/startup",
                //       "name" : "Startup",
                //       "uniqueId" : "users_wishlistStartup",
                //       "isLink" : true,
                //       "isMenu" : true,
                //       "image" : "",
                //       "dynamicLink" : true,
                //       "dynamicLinkHandler" : "",
                //       "subMenuMappingId" : "users_wishlistStartup",
                //       "subMenusId" : "users_wishlist"
                //     },
                //     {
                //       "link" : "/admin/users/wishlist/investor",
                //       "name" : "Investor",
                //       "uniqueId" : "users_wishlistinvestor",
                //       "isLink" : true,
                //       "isMenu" : true,
                //       "image" : "",
                //       "dynamicLink" : true,
                //       "dynamicLinkHandler" : "",
                //       "subMenuMappingId" : "users_wishlistInvestor",
                //       "subMenusId" : "users_wishlist"
                //     },
                //     {
                //       "link" : "/admin/users/wishlist/serviceProvider",
                //       "name" : "Service Provider",
                //       "uniqueId" : "users_wishlistServiceProvider",
                //       "isLink" : true,
                //       "isMenu" : true,
                //       "image" : "",
                //       "dynamicLink" : true,
                //       "dynamicLinkHandler" : "",
                //       "subMenuMappingId" : "users_wishlistServiceProvider",
                //       "subMenusId" : "users_wishlist"
                //     },
                //     {
                //       "link" : "/admin/users/wishlist/company",
                //       "name" : "Company",
                //       "uniqueId" : "users_wishlistCompany",
                //       "isLink" : true,
                //       "isMenu" : true,
                //       "image" : "",
                //       "dynamicLink" : true,
                //       "dynamicLinkHandler" : "",
                //       "subMenuMappingId" : "users_wishlistCompany",
                //       "subMenusId" : "users_wishlist"
                //     },
                //     {
                //       "link" : "/admin/users/wishlist/institution",
                //       "name" : "Institution",
                //       "uniqueId" : "users_wishlistInstitution",
                //       "isLink" : true,
                //       "isMenu" : true,
                //       "image" : "",
                //       "dynamicLink" : true,
                //       "dynamicLinkHandler" : "",
                //       "subMenuMappingId" : "users_wishlistInstitution",
                //       "subMenusId" : "users_wishlist"
                //     }
                //   ]
                // },
                {
                  "link" : "/admin/users/transactions",
                  "name" : "Transactions",
                  "uniqueId" : "users_transactions",
                  "isLink" : true,
                  "isMenu" : true,
                  "image" : "",
                  "dynamicLink" : true,
                  "dynamicLinkHandler" : "",
                  "subMenusId" : "users_cluster",
                  "subMenuMappingId" : "users_transactions"
                },
                {
                  "link" : "/admin/users/library",
                  "name" : "Library",
                  "uniqueId" : "users_library",
                  "isLink" : true,
                  "isMenu" : true,
                  "image" : "",
                  "dynamicLink" : true,
                  "dynamicLinkHandler" : "",
                  "subMenusId" : "users_cluster",
                  "subMenuMappingId" : "users_library"
                },
                // {
                //   "link": "/admin/users/history",
                //   "name": "History",
                //   "uniqueId": "users_History",
                //   "isLink": true,
                //   "isMenu": true,
                //   "image": "",
                //   "dynamicLink": true,
                //   "dynamicLinkHandler": "",
                //   "subMenusId": "users_cluster",
                //   "subMenuMappingId": "users_History"
                // }

              ]
            },

            {
              "link": "/admin/users/history",
              "name": "History",
              "uniqueId": "users_History",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/documents/history",
                  "name": "List Clusters",
                  "uniqueId": "users_HistoryList",
                  "subMenuMappingId": "users_HistoryList",
                  "subMenusId": "users_cluster",
                  "dynamicLink" : true,
                  "dynamicLinkHandler" : "",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }
              ]
            },

            // {
            //   "link": "/admin/users/chapter",
            //   "name": "Chapter",
            //   "uniqueId": "users_chapter",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   "dynamicLink": true,
            //   "dynamicLinkHandler": "",
            //   "subMenusId": "users",
            //   "subMenuMappingId": "users_chapterDetails"
            // },
            // {
            //   "link": "/admin/users/community",
            //   "name": "Community",
            //   "uniqueId": "users_community",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   "dynamicLink": true,
            //   "dynamicLinkHandler": "",
            //   "subMenusId": "users",
            //   "subMenuMappingId": "users_communityDetails"
            // },
          ]
        },
        {
          "image" : "ml my-ml-documents_2",
          "link" : "/admin/documents/clusterList",
          "uniqueId" : "documents",
          "name" : "Documents",
          "isLink" : true,
          "isMenu" : true,
          "subMenu" : [
            {
              "link" : "/admin/documents/clusterList",
              "name" : "Cluster",
              "uniqueId" : "documents_Clusters",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu": [
                {
                  "link": "/admin/documents/clusterList",
                  "name": "List Clusters",
                  "uniqueId": "documents_ClusterList",
                  "subMenuMappingId":"documents_Clusters",
                  "subMenusId":"documents",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                }
              ]
            },
            {
              "link" : "/admin/documents/chapterList",
              "name" : "Chapter",
              "uniqueId" : "documents_Chapter",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu": [
                {
                  "link": "/admin/documents/chapterList",
                  "name": "List Clusters",
                  "uniqueId": "documents_ChapterList",
                  "subMenuMappingId":"documents_Chapter",
                  "subMenusId":"documents",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                }
              ]
            },
            {
              "link" : "/admin/documents/communityList",
              "name" : "Community",
              "uniqueId" : "documents_Community",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu": [
                {
                  "link": "/admin/documents/communityList",
                  "name": "List Clusters",
                  "uniqueId": "documents_CommunityList",
                  "subMenuMappingId":"documents_Community",
                  "subMenusId":"documents",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/documents/history",
                  "name": "History",
                  "uniqueId": "documents_History",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenu": [
                    {
                      "link": "/admin/documents/history",
                      "name": "List Clusters",
                      "uniqueId": "documents_HistoryList",
                      "subMenuMappingId": "documents_History",
                      "subMenusId": "documents",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    }
                  ]
                },
              ]
            }
          ]

        },
        {
          "image" : "ml my-ml-templates",
          "link" : "/admin/templates/templateList",
          "name" : "Templates",
          "isLink" : true,
          "isMenu" : true,
          "uniqueId" : "templates",
          "subMenu": [
            {
              "link": "/admin/templates/templateList",
              "name": "Template List",
              "uniqueId": "templates_List",
              "subMenuMappingId":"",
              "subMenusId":"templates",
              "isLink": true,
              "isMenu": false,
              "image": "",
              "subMenu":[
                {
                  "link": "/templates/assignTemplate/:id",
                  "name": "Edit Template",
                  "uniqueId": "templates_assignment_edit",
                  "subMenuMappingId":"templates_List",
                  "subMenusId":"templates",
                  "isLink": true,
                  "isMenu": false,
                  "image": "",
                  "subMenu":[
                    {
                      "link": "/templates/assignTemplate/",
                      "name": " Assign Template",
                      "uniqueId": "templates_assignment",
                      "subMenuMappingId":"templates_List",
                      "subMenusId":"templates",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    }

                  ]
                },
              ]
            },
            {
              "link": "/admin/templates/history",
              "name": "History",
              "uniqueId": "templates_History",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink" : false,
              "dynamicLinkHandler" : "",
              "subMenusId":"templates",
              "subMenuMappingId": "templates_History"
            },
          ]
        },
        {
          "image": "ml my-ml-transactions",
          "link": "/admin/transactions/requestedList",
          "name": "Transactions",
          "uniqueId": "transaction",
          "isLink": true,
          "isMenu": true,
          "subMenu": [
            {
              "link": "/admin/transactions/requestedList",
              "name": "Internal Requests",
              "uniqueId": "transaction_Requestes",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/transactions/requestedList",
                  "name": "List Requests",
                  "uniqueId": "transaction_RequestList",
                  "subMenuMappingId": "transaction_Requestes",
                  "subMenusId": "transaction",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/transactions/editRequests",
                  "name": "Edit Requestes",
                  "uniqueId": "transaction_EditRequests",
                  "subMenuMappingId": "transaction_Requestes",
                  "subMenusId": "transaction",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/transactions/approvedList",
              "name": "Approved Requests",
              "uniqueId": "transaction_Approved",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/transactions/approvedList",
                  "name": "List Requests",
                  "uniqueId": "transaction_ApprovedList",
                  "subMenuMappingId": "transaction_Approved",
                  "subMenusId": "transaction",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/transactions/editRequests",
                  "name": "Edit Requests",
                  "uniqueId": "transaction_EditApproved",
                  "subMenuMappingId": "transaction_Approved",
                  "subMenusId": "transaction",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }
              ]
            },
            {
              "link" : "/admin/transactions/rejectList",
              "name" : "Rejected Requests",
              "uniqueId" : "transaction_Reject",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu": [
                {
                  "link": "/admin/transactions/rejectedList",
                  "name": "List Requests",
                  "uniqueId": "transaction_RejectedList",
                  "subMenuMappingId":"transaction_Reject",
                  "subMenusId":"transaction",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/transactions/editRequests",
                  "name": "Edit Requests",
                  "uniqueId": "transaction_EditRejected",
                  "subMenuMappingId":"transaction_Reject",
                  "subMenusId":"transaction",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/transactions/registrationRequested",
              "name": "Registrations",
              "uniqueId": "transaction_Registration",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenusId": "transaction",
              "subMenuMappingId": "transaction_Registration",
              "subMenu": [
                {
                  "link": "/admin/transactions/registrationRequested",
                  "name": "Requested",
                  "uniqueId": "transaction_registration_requested",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "transaction_Registration",
                  "subMenuMappingId": "transaction_registration_requested",
                  "subMenu": [
                    {
                      "link": "/admin/transactions/registrationRequested",
                      "name": "Request List",
                      "uniqueId": "transaction_registration_requested_list",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "subMenusId": "transaction_Registration",
                      "subMenuMappingId": "transaction_registration_requested_list"
                    },
                    {
                      "link": "/admin/transactions/registrationRequested/edit",
                      "name": "Backend Users",
                      "uniqueId": "transaction_registration_requested_edit",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "transaction_Registration",
                      "subMenuMappingId": "transaction_registration_requested"
                    }
                  ]
                },
                {
                  "link": "/admin/transactions/registrationApprovedList",
                  "name": "Approved",
                  "uniqueId": "transaction_registration_approved",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "transaction_Registration",
                  "subMenuMappingId": "transaction_registration_approved",
                  "subMenu": [
                    {
                      "link": "/admin/transactions/registrationApprovedList",
                      "name": "Request List",
                      "uniqueId": "transaction_registration_approved_list",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "subMenusId": "transaction_Registration",
                      "subMenuMappingId": "transaction_registration_approved_list"
                    },
                    {
                      "link": "/admin/transactions/registrationRequested/edit",
                      "name": "Backend Users",
                      "uniqueId": "transaction_registration_approved_edit",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "transaction_Registration",
                      "subMenuMappingId": "transaction_registration_approved"
                    }
                  ]
                },

                {
                  "link": "/admin/transactions/createRegistration",
                  "name": "Create",
                  "uniqueId": "transaction_registration_create",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "transaction_Registration",
                },
                {
                  "link": "/admin/transactions/rejectedRegistrations",
                  "name": "Reject",
                  "uniqueId": "transaction_registration_reject",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "transaction_Registration"
                },
                {
                  "link": "/admin/transactions/registrationHistory",
                  "name": "History",
                  "uniqueId": "transaction_registration_history",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "transaction_Registration",
                  //"subMenuMappingId":"transaction_registration_create"
                }
              ]
            },
            {
              "link": "/admin/transactions/portfolio/requestedPortfolioList",
              "name": "Portfolios",
              "uniqueId": "portfolio",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenusId": "transaction",
              "subMenuMappingId": "portfolio",
              "subMenu": [
                {
                  "link": "/admin/transactions/portfolio/requestedPortfolioList",
                  "name": "Requested",
                  "uniqueId": "portfolio_requested",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "portfolio",
                  "subMenuMappingId": "portfolio_requested",
                  "subMenu": [
                    {
                      "image": "/images/cluster_icon.png",
                      "link": "/admin/transactions/portfolio/requestedPortfolioList/ideatorDetails",
                      "name": "Detail",
                      "uniqueId": "transaction_portfolio_EditRequests",
                      "isLink": true,
                      "isMenu": true,
                      "hideSubMenu": true,
                      "subMenusId": "portfolio_requested",
                    },
                    {
                      "image": "/images/cluster_icon.png",
                      "link": "/admin/transactions/portfolio/requestedPortfolioList/ideatorDetails",
                      "name": "Detail",
                      "uniqueId": "transaction_portfolio_viewPortfolio",
                      "isLink": true,
                      "isMenu": true,
                      "hideSubMenu": true,
                      "subMenusId": "portfolio_requested",
                    }
                  ]
                },
                {
                  "link": "/admin/transactions/portfolio/approvedPortfolioList",
                  "name": "Approved",
                  "uniqueId": "portfolio_approved",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "portfolio",
                  "subMenuMappingId": "portfolio_approved"
                },
                {
                  "link": "/admin/transactions/portfolio/history",
                  "name": "History",
                  "uniqueId": "portfolio_history",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "portfolio",
                },
              ]
            },
            {
              "link" : "/admin/transactions/office",
              "name" : "Office",
              "uniqueId" : "transaction_office_list",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu" : [
                {
                  "link" : "/admin/transactions/office",
                  "name" : "Office",
                  "uniqueId" : "transaction_office",
                  "subMenuMappingId" : "transaction_office_list",
                  "subMenusId" : "transaction",
                  "isLink" : true,
                  "isMenu" : false,
                  "image" : ""
                }
              ]
            },
            {
              "link" : "/admin/transactions/processSetupList",
              "name" : "ProcessSetUp",
              "uniqueId" : "transaction_ProcessSetup",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu": [
                {
                  "link": "/admin/transactions/processSetupList",
                  "name": "List Process Setup",
                  "uniqueId": "transaction_ProcessSetupList",
                  "subMenuMappingId":"transaction_ProcessSetup",
                  "subMenusId":"transaction",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/transactions/editProcessSetup",
                  "name": "Edit Process Setup",
                  "uniqueId": "transaction_EditProcessSetup",
                  "subMenuMappingId":"transaction_ProcessSetup",
                  "subMenusId":"transaction",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/transactions/shareList",
              "name": "Share",
              "uniqueId": "transaction_Share",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/transactions/shareList",
                  "name": "List Share",
                  "uniqueId": "transaction_ShareList",
                  "subMenuMappingId": "transaction_Share",
                  "subMenusId": "transaction",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/transactions/history",
              "name": "History",
              "uniqueId": "History_Log",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenusId": "transaction"
              // "subMenuMappingId":"Transactions_Log"
            },
            {
              "link": "/admin/transactions/serviceCardsList",
              "name": "Service Cards",
              "uniqueId": "Service_Cards",
              "subMenusId": "transaction",
              "isLink": true,
              "isMenu": true,
              "image": ""
            },
          ]
        },
        {
          "image": "ml my-ml-notifications",
          "link": "",
          "name": "Notifications",
          "uniqueId": "notifications",
          "isLink": true,
          "isMenu": true,
        },
        {
          "image": "ml ml-chat",
          "link": "",
          "name": "Conversations",
          "uniqueId": "conversations",
          "isLink": true,
          "isMenu": true,
        },
        {
          "image" : "ml my-ml-settings_new",
          "link" : "/admin/settings/departmentsList",
          "name" : "Settings",
          "uniqueId" : "settings",
          "isLink" : true,
          "isMenu" : true,
          "subMenu" : [
            {
              "link" : "/admin/settings/departmentsList",
              "name" : "Departments",
              "uniqueId" : "settings_Departments",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu": [

                {
                  "link": "/admin/settings/addDepartment",
                  "name": "Add Departments",
                  "uniqueId": "settings_AddDepartment",
                  "subMenuMappingId":"settings_Departments",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/departmentsList",
                  "name": "List Department",
                  "uniqueId": "settings_DepartmentList",
                  "subMenuMappingId":"settings_Departments",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editDepartment",
                  "name": "Edit Department",
                  "uniqueId": "settings_EditDepartment",
                  "subMenuMappingId":"settings_Departments",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                },
              ]
            },
            {
              "link" : "/admin/settings/subDepartmentsList",
              "name" : "Sub Departments",
              "uniqueId" : "settings_SubDepartments",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              subMenu:[{
                "link": "/admin/settings/addSubDepartment",
                "name": "Add Sub Departments",
                "uniqueId": "settings_AddSubDepartments",
                "subMenuMappingId":"settings_SubDepartments",
                "subMenusId":"settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/subDepartmentsList",
                  "name": "List Sub Department",
                  "uniqueId": "settings_SubDepartmentList",
                  "subMenuMappingId":"settings_SubDepartments",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editSubDepartment",
                  "name": "Edit Sub Department",
                  "uniqueId": "settings_EditSubDepartments",
                  "subMenuMappingId":"settings_SubDepartments",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link" : "/admin/settings/templatesList",
              "name" : "Templates",
              "uniqueId" : "settings_templates",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              subMenu:[
                {
                  "link": "/admin/settings/templatesList",
                  "name": "List Templates",
                  "uniqueId": "settings_templatesList",
                  "subMenuMappingId":"settings_templates",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
              ]
            },
            {
              "image" : "/images/cluster_icon.png",
              "link" : "/admin/settings/hierarchy/platformhierarchy",
              "name" : "Hierarchy",
              "uniqueId"   :"hierarchy_details",
              "isLink" : true,
              "isMenu" : true,
              "hideSubMenu":true,
              "subMenu":[
                {
                  "link": "/admin/settings/hierarchy/clusterhierarchy/:clusterId/chapters",
                  "name": "cluster hierarchy",
                  "uniqueId": "hierarchy",
                  "subMenuMappingId":"",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": "",
                  "subMenu":[
                    {
                      "link": "/settings/hierarchy/clusterhierarchy/:clusterId/hierarchyDetails",
                      "name": " cluster hierarchy",
                      "uniqueId": "hierarchy_chapters",
                      "subMenuMappingId":"",
                      "subMenusId":"settings",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                  ]
                },
              ]
            },
            {
              "link" : "/admin/settings/rolesList",
              "name" : "Roles & Permissions",
              "uniqueId" : "settings_roles",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              subMenu:[{
                "link": "/admin/settings/createRole",
                "name": "Add Roles",
                "uniqueId": "settings_createRole",
                "subMenuMappingId":"settings_roles",
                "subMenusId":"settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/rolesList",
                  "name": "List Roles",
                  "uniqueId": "settings_rolesList",
                  "subMenuMappingId":"settings_roles",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editRoleType",
                  "name": "Edit Roles",
                  "uniqueId": "settings_EditRole",
                  "subMenuMappingId":"settings_roles",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link" : "/admin/settings/backendUserList",
              "name" : "Backend Users",
              "uniqueId" : "settings_BackendUsers",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              subMenu:[{
                "link": "/admin/settings/addBackendUser",
                "name": "Add BackendUser",
                "uniqueId": "settings_AddBackendUser",
                "subMenuMappingId":"settings_BackendUsers",
                "subMenusId":"settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/backendUserList",
                  "name": "List BackendUser",
                  "uniqueId": "settings_BackendUserList",
                  "subMenuMappingId":"settings_BackendUsers",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editBackendUser",
                  "name": "Edit BackendUser",
                  "uniqueId": "settings_EditBackendUser",
                  "subMenuMappingId":"settings_BackendUsers",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            // {
            //   "link" : "/admin/settings/requestTypeList",
            //   "name" : "Request Types",
            //   "uniqueId" : "settings_requestTypes",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   subMenu:[{
            //     "link": "/admin/settings/addRequestType",
            //     "name": "Add RequestType",
            //     "uniqueId": "settings_AddRequestType",
            //     "subMenuMappingId":"settings_requestTypes",
            //     "subMenusId":"settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/requestTypeList",
            //       "name": "List RequestType",
            //       "uniqueId": "settings_RequestTypeList",
            //       "subMenuMappingId":"settings_requestTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editRequestType",
            //       "name": "Edit RequestType",
            //       "uniqueId": "settings_EditRequestType",
            //       "subMenuMappingId":"settings_requestTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            //
            // },
            {
              "link" : "/admin/settings/taxationList",
              "name" : "Taxation",
              "uniqueId" : "settings_Taxations",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu": [

                {
                  "link": "/admin/settings/addTaxation",
                  "name": "Add Taxation",
                  "uniqueId": "settings_AddTaxation",
                  "subMenuMappingId":"settings_Taxations",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/taxationList",
                  "name": "List Taxation",
                  "uniqueId": "settings_TaxationList",
                  "subMenuMappingId":"settings_Taxations",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editTaxation",
                  "name": "Edit Taxation",
                  "uniqueId": "settings_EditTaxation",
                  "subMenuMappingId":"settings_Taxations",
                  "subMenusId":"settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                },
              ]
            },
            {
              "link" : "/admin/settings/Workflow",
              "name" : "Workflow",
              "uniqueId" : "settings_workflow",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenusId":"portfolio",
            },
            {
              "link": "/admin/settings/history",
              "name": "History",
              "uniqueId": "subChaptersSettings_historyList",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [
                {
                  "link": "/admin/settings/history",
                  "name": "History List",
                  "uniqueId": "subChapterNonMoolyaSettings_historyList",
                  "subMenuMappingId": "subChaptersSettings_historyList",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
              ]
            },
          ]
        },
        {
          "image": "ml my-ml-offerings",
          "link": "",
          "name": "Offerings",
          "uniqueId": "offerings",
          "isLink": true,
          "isMenu": true,
        },
      ]
    }
  });
}
