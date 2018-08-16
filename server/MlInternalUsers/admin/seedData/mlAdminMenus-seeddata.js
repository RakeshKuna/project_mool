if (Meteor.isServer) {
  MlMenus.upsert({name: "mlAdminMenu"}, {
    $set: {
      "name": "mlAdminMenu",
      "menu": [
        {
          "image": "ml my-ml-dashboard",
          "link": "/admin/dashboard/clusters",
          "name": "Ecosystem",
          "uniqueId": "dashboard",
          "isLink": true,
          "isMenu": true,
          "subMenu": [
            {
              "link": "/admin/dashboard/clusters",
              "name": "Clusters",
              "uniqueId": "dashboard_clusters",
              "subMenuMappingId": "dashboard_clusters",
              "subMenusId": "dashboard",
              "isLink": true,
              "isMenu": true,
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
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "uniqueId": "dashboard_communities",
              "subMenuMappingId": "dashboard_communities",
              "subMenusId": "dashboard",
              "isLink": true,
              "image": "",
              "subMenu": [
                // {
                //   "link": "/admin/dashboard/clusters",
                //   "name": "Backend User Details",
                //   "uniqueId": "dashboard_backendUserDetails",
                //   "subMenuMappingId": "dashboard_communities",
                //   "subMenusId": "dashboard",
                //   "isLink": true,
                //   "isMenu": true,
                //   "image": ""
                // }
                {
                  "link" : "/admin/dashboard/:clusterId/:chapterId/:subChapterId/:communityType/portfolio/:portfolioId",
                  "name" : "dashboard users",
                  "uniqueId" : "dashboard_userDetails",
                  "isLink" : true,
                  "isMenu" : false,
                  "image" : "",
                  "dynamicLink" : true,
                  "dynamicLinkHandler" : "",
                  "subMenuMappingId" : "dashboard_userDetails",
                  "subMenusId" : "dashboard_communities"
                }
              ]
            }
          ]
        },
        {
          "image": "ml my-ml-cluster",
          "link": "/admin/clusters",
          "name": "Cluster",
          "uniqueId": "cluster",
          "isLink": true,
          "isMenu": true,
          "hideSubMenu": true,
          "subMenu": [
            {
              "link": "/admin/clusters/clusterDetails",
              "name": "Cluster Details",
              "uniqueId": "cluster_clusterDetails",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "subMenusId": "cluster",
              "subMenuMappingId": "cluster_clusterDetails"
            },
            {
              "link": "/admin/clusters/chapters",
              "name": "Chapters",
              "uniqueId": "cluster_chapters",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "subMenusId": "cluster",
              "subMenuMappingId": "cluster_chapters",
              "subMenu": [
                {
                  "link": "/admin/clusters/subChapters/subChapterDetails",
                  "name": "Sub Chapter Details",
                  "uniqueId": "cluster_chapter_subChapterDetails",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "cluster_chapters",
                  "subMenuMappingId": "cluster_chapter_subChapterDetails",
                  "subMenu": [
                    {
                      "link": "/admin/clusters/subChapters/anchorDetails",
                      "name": "Anchor Details",
                      "uniqueId": "cluster_chapter_anchorDetails",
                      "isLink": true,
                      "isMenu": false,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "cluster_chapters",
                      "subMenuMappingId": "cluster_chapter_subChapterDetails"
                    }
                  ]
                },
                {
                  "link": "/admin/clusters/subChapters/communities",
                  "name": "Communities",
                  "uniqueId": "cluster_chapter_communities",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "cluster_chapters",
                  "subMenuMappingId": "cluster_chapter_communities",
                  "subMenu": [
                    {
                      "link": "/admin/clusters/subChapters/communities/communityDetails",
                      "name": "Community Details",
                      "uniqueId": "cluster_chapter_communities_communityDetails",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "cluster_chapter_communities",
                      "subMenuMappingId": "cluster_chapter_communities_communityDetails"
                    },
                    {
                      "link": "/admin/clusters/subChapters/communities/assignusers",
                      "name": "Backend Users",
                      "uniqueId": "cluster_chapter_communities_assignusers",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "cluster_chapter_communities",
                      "subMenuMappingId": "cluster_chapter_communities_assignusers"
                    }
                  ]
                },
                {
                  "link": "/admin/clusters/subChapters/assignusers",
                  "name": "Backend Users",
                  "uniqueId": "cluster_chapter_assignusers",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "cluster_chapters",
                  "subMenuMappingId": "cluster_chapter_assignusers"
                }
              ]
            },
            {
              "link": "/admin/clusters/communities",
              "name": "Communities",
              "uniqueId": "cluster_communities",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "subMenusId": "cluster",
              "subMenuMappingId": "cluster_communities",
              "subMenu": [
                {
                  "link": "/admin/clusters/communities/communityDetails",
                  "name": "Community Details",
                  "uniqueId": "cluster_communities_communityDetails",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "cluster_communities",
                  "subMenuMappingId": "cluster_communities_communityDetails"
                },
                {
                  "link": "/admin/clusters/communities/assignusers",
                  "name": "Backend Users",
                  "uniqueId": "cluster_communities_assignusers",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "cluster_communities",
                  "subMenuMappingId": "cluster_communities_assignusers"
                }
              ]
            },
            {
              "link": "/admin/clusters/assignusers",
              "name": "Backend Users",
              "uniqueId": "cluster_assignusers",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "subMenusId": "cluster",
              "subMenuMappingId": "cluster_assignusers"
            },
            {
              "link": "/admin/clusters/history",
              "name": "History",
              "uniqueId": "cluster_history",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "subMenusId": "cluster",
              "subMenuMappingId": "cluster_history"
            }
          ]
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
                  // "link" : "/admin/chapters/subChapters",
                  // "name" : "Sub Chapters",
                  // "uniqueId" : "chapter_subChapters",
                  // "isLink" : true,
                  // "isMenu" : true,
                  // "image" : "",
                  // "dynamicLink" : true,
                  // "hideSubMenu":true,
                  // "dynamicLinkHandler" : "",
                  // "subMenusId":"chapter_chapters",
                  // "subMenuMappingId":"chapter_subChapters",
                  // "subMenu" : [
                  //   {
                  "link": "/admin/chapters/subChapters/subChapterDetails",
                  "name": "SubChapterDetails",
                  "uniqueId": "chapter_subChapterDetails",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "dynamicLink": true,
                  "dynamicLinkHandler": "",
                  "subMenusId": "chapter_chapters",
                  "subMenuMappingId": "chapter_subChapterDetails",
                  "subMenu": [
                    {
                      "link": "/admin/chapters/subChapters/anchorDetails",
                      "name": "Anchor Details",
                      "uniqueId": "chapter_anchorDetails",
                      "isLink": true,
                      "isMenu": false,
                      "image": "",
                      "dynamicLink": true,
                      "dynamicLinkHandler": "",
                      "subMenusId": "chapter_chapters",
                      "subMenuMappingId": "chapter_subChapterDetails"
                    }
                  ]
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
              //   }
              // ]
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
          "link": "/admin/community",
          "uniqueId": "community",
          "name": "Community",
          "isLink": true,
          "isMenu": true,
          "hideSubMenu": true,
          "subMenu": [
            {
              "link": "/admin/community/communityDetails",
              "name": "Community Details",
              "uniqueId": "community_Community_Details",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "subMenusId": "community",
              "subMenuMappingId": "community_Community_Details"
            },
            {
              "link": "/admin/community/history",
              "name": "History",
              "uniqueId": "community_History_Details",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "dynamicLink": true,
              "dynamicLinkHandler": "",
              "subMenusId": "community",
              "subMenuMappingId": "community_History_Details"
            },
            // {
            //   "link" : "/admin/community/assignusers",
            //   "name" : "Backend Users",
            //   "uniqueId" : "community_assignusers",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   "dynamicLink" : true,
            //   "dynamicLinkHandler" : "",
            //   "subMenusId":"community",
            //   "subMenuMappingId":"community_assignusers"
            // }
          ]
        },
        {
          "image": "ml my-ml-documents_2",
          "link": "/admin/documents/clusterList",
          "uniqueId": "documents",
          "name": "Documents",
          "isLink": true,
          "isMenu": true,
          "subMenu": [
            {
              "link": "/admin/documents/clusterList",
              "name": "Cluster",
              "uniqueId": "documents_Clusters",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/documents/clusterList",
                  "name": "List Clusters",
                  "uniqueId": "documents_ClusterList",
                  "subMenuMappingId": "documents_Clusters",
                  "subMenusId": "documents",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/documents/chapterList",
              "name": "Chapter",
              "uniqueId": "documents_Chapter",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/documents/chapterList",
                  "name": "List Clusters",
                  "uniqueId": "documents_ChapterList",
                  "subMenuMappingId": "documents_Chapter",
                  "subMenusId": "documents",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/documents/communityList",
              "name": "Community",
              "uniqueId": "documents_Community",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/documents/communityList",
                  "name": "List Clusters",
                  "uniqueId": "documents_CommunityList",
                  "subMenuMappingId": "documents_Community",
                  "subMenusId": "documents",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                }
              ]
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
          "image": "ml my-ml-templates",
          "link": "/admin/templates/templateList",
          "name": "Templates",
          "isLink": true,
          "isMenu": true,
          "uniqueId": "templates",
          "subMenu": [
            {
              "link": "/admin/templates/templateList",
              "name": "Template List",
              "uniqueId": "templates_List",
              "subMenuMappingId": "templates_List",
              "subMenusId": "templates",
              "isLink": true,
              "isMenu": false,
              "image": "",
              "subMenu": [
                {
                  "link": "/templates/assignTemplate/:id",
                  "name": "Edit Template",
                  "uniqueId": "templates_assignment_edit",
                  "subMenuMappingId": "templates_List",
                  "subMenusId": "templates",
                  "isLink": true,
                  "isMenu": false,
                  "image": "",
                  "subMenu": [
                    {
                      "link": "/templates/assignTemplate/",
                      "name": " Assign Template",
                      "uniqueId": "templates_assignment",
                      "subMenuMappingId": "templates_List",
                      "subMenusId": "templates",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    }

                  ]
                },
              ]
            },
             {
             "link" : "/admin/templates/history",
             "name" : "History",
             "uniqueId" : "templates_History",
             "isLink" : true,
             "isMenu" : true,
             "image" : "",
             "dynamicLink" : false,
             "dynamicLinkHandler" : "",
             "subMenusId":"templates",
             "subMenuMappingId": "templates_History"
             }/*,
             {
              "link": "/admin/templates/history",
              "name": "History",
              "uniqueId": "templates_History",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/templates/history",
                  "name": "Templates History",
                  "uniqueId": "templates_HistoryList",
                  "subMenuMappingId": "templates_History",
                  "subMenusId": "templates",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                }
              ]
            },*/
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
              "link": "/admin/transactions/rejectList",
              "name": "Rejected Requests",
              "uniqueId": "transaction_Reject",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/transactions/rejectedList",
                  "name": "List Requests",
                  "uniqueId": "transaction_RejectedList",
                  "subMenuMappingId": "transaction_Reject",
                  "subMenusId": "transaction",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/transactions/editRequests",
                  "name": "Edit Requests",
                  "uniqueId": "transaction_EditRejected",
                  "subMenuMappingId": "transaction_Reject",
                  "subMenusId": "transaction",
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
                  //"subMenuMappingId":"transaction_registration_create"
                },
                {
                  "link": "/admin/transactions/rejectedRegistrations",
                  "name": "Reject",
                  "uniqueId": "transaction_registration_reject",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "transaction_Registration",
                  //"subMenuMappingId":"transaction_registration_create"
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

                // {
                //   "link" : "/admin/transactions/portfolio/createPortfolio",
                //   "name" : "Create",
                //   "uniqueId" : "portfolio_create",
                //   "isLink" : true,
                //   "isMenu" : true,
                //   "image" : "",
                //   "subMenusId":"portfolio",
                //   //"subMenuMappingId":"transaction_registration_create"
                // },
                {
                  "link": "/admin/transactions/portfolio/history",
                  "name": "History",
                  "uniqueId": "portfolio_history",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "portfolio",
                  //"subMenuMappingId":"transaction_registration_create"
                },
                // {
                //   "link" : "/admin/transactions/portfolio/requestedPortfolioList/edit",
                //   "name" : "Edit",
                //   "uniqueId" : "transaction_portfolio_requested_edit",
                //   "isLink" : true,
                //   "isMenu" : true,
                //   "image" : "",
                //   "subMenusId":"portfolio"
                // },
                //
                // {
                //   "link" : "/admin/transactions/portfolio/editRequests",
                //   "name" : "Edit",
                //   "uniqueId" : "transaction_portfolio_EditRequests",
                //   "isLink" : true,
                //   "isMenu" : true,
                //   "image" : "",
                //   "subMenusId":"portfolio"
                // },
                // {
                //   "link" : "/admin/transactions/portfolio/viewPortfolio",
                //   "name" : "Edit",
                //   "uniqueId" : "transaction_portfolio_viewPortfolio",
                //   "isLink" : true,
                //   "isMenu" : true,
                //   "image" : "",
                //   "subMenusId":"portfolio"
                // }
              ]
            },
            {
              "link": "/admin/transactions/office",
              "name": "Office",
              "uniqueId": "transaction_office_list",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/transactions/office",
                  "name": "Office",
                  "uniqueId": "transaction_office",
                  "subMenuMappingId": "transaction_office_list",
                  "subMenusId": "transaction",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/transactions/processSetupList",
              "name": "Investor Process Setup",
              "uniqueId": "transaction_ProcessSetup",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [
                {
                  "link": "/admin/transactions/processSetupList",
                  "name": "List Process Setup",
                  "uniqueId": "transaction_ProcessSetupList",
                  "subMenuMappingId": "transaction_ProcessSetup",
                  "subMenusId": "transaction",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/transactions/editProcessSetup",
                  "name": "Edit Process Setup",
                  "uniqueId": "transaction_EditProcessSetup",
                  "subMenuMappingId": "transaction_ProcessSetup",
                  "subMenusId": "transaction",
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
                // {
                //   "link": "/admin/transactions/editProcessSetup",
                //   "name": "Edit Process Setup",
                //   "uniqueId": "transaction_EditProcessSetup",
                //   "subMenuMappingId": "transaction_ProcessSetup",
                //   "subMenusId": "transaction",
                //   "isLink": true,
                //   "isMenu": true,
                //   "image": ""
                // }
              ]
            },

            {
              "link": "/admin/transactions/systemsLog ",
              "name": "System",
              "uniqueId": "systems_Log",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenusId": "transaction"
              // "subMenuMappingId":"Transactions_Log"
            },
            {
              "link": "/admin/transactions/interactionsLog ",
              "name": "Interactions",
              "uniqueId": "Interactions_Log",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenusId": "transaction"
              // "subMenuMappingId":"Transactions_Log"
            },
            {
              "link": "/admin/transactions/conversationsLog ",
              "name": "Conversations",
              "uniqueId": "Conversations_Log",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenusId": "transaction"
              // "subMenuMappingId":"Transactions_Log"
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
              "image": "",
              "subMenu": [
                // {
                //   "link": "/admin/transactions/serviceCardsList",
                //   "name": "List ServiceCards",
                //   "uniqueId": "Service_Cards",
                //   "subMenuMappingId": "transaction_ServiceCards",
                //   "subMenusId": "transaction",
                //   "isLink": true,
                //   "isMenu": false,
                //   "image": ""
                // },
                // {
                //   "link": "/admin/transactions/editServiceCards",
                //   "name": "Edit ServiceCards",
                //   "uniqueId": "transaction_EditServiceCards",
                //   "subMenuMappingId": "transaction_ServiceCards",
                //   "subMenusId": "transaction",
                //   "isLink": true,
                //   "isMenu": true,
                //   "image": ""
                // }
              ]
            },

            {
              "link": "/admin/transactions/appointments",
              "name": "Appointments",
              "uniqueId": "appointments",
              "subMenusId": "transaction",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [

              ]
            },
            //       "subMenu":[
            //
          ]
        },
        /**
         * routes for packages left nav
         * */
        {
          "image" : "ml my-ml-packages",
          "link" : "/admin/packages/officeList",
          "name" : "Packages",
          "uniqueId" : "packages",
          "isLink" : true,
          "isMenu" : true,
          "subMenu" : [
            {
              "link" : "/admin/packages/officeList",
              "name" : "Office Packages",
              "uniqueId" : "packages_office",
              "isLink" : true,
              "isMenu" : true,
              "subMenu" : [
                {
                  "link" : "/admin/packages/addOffice",
                  "name" : "Add Package",
                  "uniqueId" : "packages_AddOffice",
                  "subMenuMappingId" : "packages_office",
                  "subMenusId" : "packages",
                  "isLink" : true,
                  "isMenu" : false,
                  "image" : ""
                },
                {
                  "link" : "/admin/packages/officeList",
                  "name" : "List Packages",
                  "uniqueId" : "packages_ListOffice",
                  "subMenuMappingId" : "packages_office",
                  "subMenusId" : "packages",
                  "isLink" : true,
                  "isMenu" : false,
                  "image" : ""
                },
                {
                  "link" : "/admin/packages/editOffice",
                  "name" : "Edit Packages",
                  "uniqueId" : "packages_EditOffice",
                  "subMenuMappingId" : "packages_office",
                  "subMenusId" : "packages",
                  "isLink" : true,
                  "isMenu" : true,
                  "image" : ""
                }
              ]
            },
            {
              "link" : "/admin/packages/history",
              "name" : "History",
              "uniqueId" : "packages_history",
              "isLink" : true,
              "isMenu" : true,
              "image" : "",
              "subMenu" : [
                {
                  "link" : "/admin/packages/history",
                  "name" : "History List",
                  "uniqueId" : "packages_historyList",
                  "subMenuMappingId" : "packages_history",
                  "subMenusId" : "packages",
                  "isLink" : true,
                  "isMenu" : false,
                  "image" : ""
                }
              ]
            }
          ]
        },
        {
          "image": "ml my-ml-settings_new",
          "link": "/admin/settings/departmentsList",
          "name": "Settings",
          "uniqueId": "settings",
          "isLink": true,
          "isMenu": true,
          "subMenu": [

            {
              "link": "/admin/settings/departmentsList",
              "name": "Departments",
              "uniqueId": "settings_Departments",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [

                {
                  "link": "/admin/settings/addDepartment",
                  "name": "Add Departments",
                  "uniqueId": "settings_AddDepartment",
                  "subMenuMappingId": "settings_Departments",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/departmentsList",
                  "name": "List Department",
                  "uniqueId": "settings_DepartmentList",
                  "subMenuMappingId": "settings_Departments",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editDepartment",
                  "name": "Edit Department",
                  "uniqueId": "settings_EditDepartment",
                  "subMenuMappingId": "settings_Departments",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/settings/subDepartmentsList",
              "name": "Sub Departments",
              "uniqueId": "settings_SubDepartments",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addSubDepartment",
                "name": "Add Sub Departments",
                "uniqueId": "settings_AddSubDepartments",
                "subMenuMappingId": "settings_SubDepartments",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/subDepartmentsList",
                  "name": "List Sub Department",
                  "uniqueId": "settings_SubDepartmentList",
                  "subMenuMappingId": "settings_SubDepartments",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editSubDepartment",
                  "name": "Edit Sub Department",
                  "uniqueId": "settings_EditSubDepartments",
                  "subMenuMappingId": "settings_SubDepartments",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },


            //changing routes path
            // {
            //   "link" : "/admin/settings/entityList",
            //   "name" : "Entity Types",
            //   "uniqueId" : "settings_entityTypes",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   subMenu:[{
            //     "link": "/admin/settings/addEntity",
            //     "name": "Add EntityType",
            //     "uniqueId": "settings_AddEntityType",
            //     "subMenuMappingId":"settings_entityTypes",
            //     "subMenusId":"settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/entityList",
            //       "name": "List EntityType",
            //       "uniqueId": "settings_EntityTypeList",
            //       "subMenuMappingId":"settings_entityTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editEntity",
            //       "name": "Edit EntityType",
            //       "uniqueId": "settings_EditEntityType",
            //       "subMenuMappingId":"settings_entityTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            // {
            //   "link" : "/admin/settings/stageOfCompanyList",
            //   "name" : "Stage Of Company",
            //   "uniqueId" : "settings_stageOfCompanyTypes",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   subMenu:[{
            //     "link": "/admin/settings/addStageOfCompany",
            //     "name": "Add StageOfCompanyType",
            //     "uniqueId": "settings_AddStageOfCompanyType",
            //     "subMenuMappingId":"settings_stageOfCompanyTypes",
            //     "subMenusId":"settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/stageOfCompanyList",
            //       "name": "List StageOfCompanyType",
            //       "uniqueId": "settings_StageOfCompanyTypeList",
            //       "subMenuMappingId":"settings_stageOfCompanyTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editStageOfCompany",
            //       "name": "Edit StageOfCompanyType",
            //       "uniqueId": "settings_EditStageOfCompanyType",
            //       "subMenuMappingId":"settings_stageOfCompanyTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },

            {
              "link": "/admin/settings/registration/entityList",
              "name": "Registrations",
              "uniqueId": "settings_registration",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenusId": "settings",
              "subMenuMappingId": "settings_registration",
              "subMenu": [
                {
                  "link": "/admin/settings/registration/entityList",
                  "name": "Entity Types",
                  "uniqueId": "settings_entityTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_registration",
                  "subMenuMappingId": "settings_entityTypes",
                  "subMenu": [
                    {
                      "link": "/admin/settings/registration/entityList",
                      "name": "List EntityType",
                      "uniqueId": "settings_EntityTypeList",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "subMenusId": "settings_registration",
                      "subMenuMappingId": "settings_entityTypes"
                    },
                    {
                      "link": "/admin/settings/registration/addEntity",
                      "name": "Add EntityType",
                      "uniqueId": "settings_AddEntityType",
                      "isLink": true,
                      "isMenu": false,
                      "image": "",
                      "subMenusId": "settings_registration",
                      "subMenuMappingId": "settings_entityTypes"
                    },
                    {
                      "link": "/admin/settings/registration/editEntity",
                      "name": "Edit EntityType",
                      "uniqueId": "settings_EditEntityType",
                      "isLink": true,
                      "isMenu": true,
                      "image": "",
                      "subMenusId": "settings_registration",
                      "subMenuMappingId": "settings_entityTypes"
                    }
                  ]
                },
                {
                  "link": "/admin/settings/registration/stageOfCompanyList",
                  "name": "Company Stages",
                  "uniqueId": "settings_stageOfCompanyTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_registration",
                  "subMenuMappingId": "settings_stageOfCompanyTypes",
                  "subMenu": [
                    {
                      "link": "/admin/settings/registration/addStageOfCompany",
                      "name": "Add StageOfCompanyType",
                      "uniqueId": "settings_AddStageOfCompanyType",
                      "subMenuMappingId": "settings_stageOfCompanyTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/registration/stageOfCompanyList",
                      "name": "List StageOfCompanyType",
                      "uniqueId": "settings_StageOfCompanyTypeList",
                      "subMenuMappingId": "settings_stageOfCompanyTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/registration/editStageOfCompany",
                      "name": "Edit StageOfCompanyType",
                      "uniqueId": "settings_EditStageOfCompanyType",
                      "subMenuMappingId": "settings_stageOfCompanyTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/registration/businessList",
                  "name": "Types Of Business",
                  "uniqueId": "settings_businessTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_registration",
                  "subMenuMappingId": "settings_businessTypes",
                  subMenu: [{
                    "link": "/admin/settings/registration/addBusiness",
                    "name": "Add BusinessType",
                    "uniqueId": "settings_AddBusinessType",
                    "subMenuMappingId": "settings_businessTypes",
                    "subMenusId": "settings_registration",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/registration/businessList",
                      "name": "List BusinessType",
                      "uniqueId": "settings_BusinessTypeList",
                      "subMenuMappingId": "settings_businessTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/registration/editBusiness",
                      "name": "Edit BusinessType",
                      "uniqueId": "settings_EditBusinessType",
                      "subMenuMappingId": "settings_businessTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/registration/lookingForList",
                  "name": "Looking For",
                  "uniqueId": "settings_lookingForTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_registration",
                  "subMenuMappingId": "settings_lookingForTypes",
                  subMenu: [{
                    "link": "/admin/settings/registration/addLookingFor",
                    "name": "Add LookingForType",
                    "uniqueId": "settings_AddLookingForType",
                    "subMenuMappingId": "settings_lookingForTypes",
                    "subMenusId": "settings_registration",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/registration/lookingForList",
                      "name": "List LookingForType",
                      "uniqueId": "settings_LookingForTypeList",
                      "subMenuMappingId": "settings_lookingForTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/registration/editLookingFor",
                      "name": "Edit LookingForType",
                      "uniqueId": "settings_EditLookingForType",
                      "subMenuMappingId": "settings_lookingForTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/registration/citizenshipList",
                  "name": "Citizenship",
                  "uniqueId": "settings_citizenshipTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_registration",
                  "subMenuMappingId": "settings_citizenshipTypes",
                  subMenu: [{
                    "link": "/admin/settings/registration/addCitizenship",
                    "name": "Add CitizenshipType",
                    "uniqueId": "settings_AddCitizenshipType",
                    "subMenuMappingId": "settings_citizenshipTypes",
                    "subMenusId": "settings_registration",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/registration/citizenshipList",
                      "name": "List CitizenshipType",
                      "uniqueId": "settings_CitizenshipTypeList",
                      "subMenuMappingId": "settings_citizenshipTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/registration/editCitizenship",
                      "name": "Edit CitizenshipType",
                      "uniqueId": "settings_EditCitizenshipType",
                      "subMenuMappingId": "settings_citizenshipTypes",
                      "subMenusId": "settings_registration",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },

              ]
            },


            {
              "link": "/admin/settings/templatesList",
              "name": "Templates",
              "uniqueId": "settings_templates",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [
                {
                  "link": "/admin/settings/templatesList",
                  "name": "List Templates",
                  "uniqueId": "settings_templatesList",
                  "subMenuMappingId": "settings_templates",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
              ]
            },
            {
              "image": "/images/cluster_icon.png",
              "link": "/admin/settings/hierarchy/platformhierarchy",
              "name": "Hierarchy",
              "uniqueId": "hierarchy_details",
              "isLink": true,
              "isMenu": true,
              "hideSubMenu": true,
              "subMenu": [
                {
                  "link": "/admin/settings/hierarchy/clusterhierarchy/:clusterId/chapters",
                  "name": "cluster hierarchy",
                  "uniqueId": "hierarchy",
                  "subMenuMappingId": "",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": "",
                  "subMenu": [
                    {
                      "link": "/settings/hierarchy/clusterhierarchy/:clusterId/hierarchyDetails",
                      "name": " cluster hierarchy",
                      "uniqueId": "hierarchy_chapters",
                      "subMenuMappingId": "",
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
              "link": "/admin/settings/rolesList",
              "name": "Roles & Permissions",
              "uniqueId": "settings_roles",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/createRole",
                "name": "Add Roles",
                "uniqueId": "settings_createRole",
                "subMenuMappingId": "settings_roles",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/rolesList",
                  "name": "List Roles",
                  "uniqueId": "settings_rolesList",
                  "subMenuMappingId": "settings_roles",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editRoleType",
                  "name": "Edit Roles",
                  "uniqueId": "settings_EditRole",
                  "subMenuMappingId": "settings_roles",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link": "/admin/settings/backendUserList",
              "name": "Backend Users",
              "uniqueId": "settings_BackendUsers",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addBackendUser",
                "name": "Add BackendUser",
                "uniqueId": "settings_AddBackendUser",
                "subMenuMappingId": "settings_BackendUsers",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/backendUserList",
                  "name": "List BackendUser",
                  "uniqueId": "settings_BackendUserList",
                  "subMenuMappingId": "settings_BackendUsers",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editBackendUser",
                  "name": "Edit BackendUser",
                  "uniqueId": "settings_EditBackendUser",
                  "subMenuMappingId": "settings_BackendUsers",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link": "/admin/settings/requestTypeList",
              "name": "Request Types",
              "uniqueId": "settings_requestTypes",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addRequestType",
                "name": "Add RequestType",
                "uniqueId": "settings_AddRequestType",
                "subMenuMappingId": "settings_requestTypes",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/requestTypeList",
                  "name": "List RequestType",
                  "uniqueId": "settings_RequestTypeList",
                  "subMenuMappingId": "settings_requestTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editRequestType",
                  "name": "Edit RequestType",
                  "uniqueId": "settings_EditRequestType",
                  "subMenuMappingId": "settings_requestTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]

            },
            {
              "link": "/admin/settings/filtersList",
              "name": "Filters",
              "uniqueId": "settings_Filters",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenu": [

                {
                  "link": "/admin/settings/addFilter",
                  "name": "Add Filters",
                  "uniqueId": "settings_AddFilter",
                  "subMenuMappingId": "settings_Filters",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/filtersList",
                  "name": "Filters List",
                  "uniqueId": "settings_FiltersList",
                  "subMenuMappingId": "settings_Filters",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editFilter",
                  "name": "Edit Filter",
                  "uniqueId": "settings_EditFilter",
                  "subMenuMappingId": "settings_Filters",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }
              ]
            },
            {
              "link": "/admin/settings/countriesList",
              "name": "Countries",
              "uniqueId": "settings_Countries",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/countriesList",
                "name": "List Countries",
                "uniqueId": "settings_CountriesList",
                "subMenuMappingId": "settings_Countries",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/editCountry",
                  "name": "Edit Countries",
                  "uniqueId": "settings_EditCountry",
                  "subMenuMappingId": "settings_Countries",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link": "/admin/settings/statesList",
              "name": "States",
              "uniqueId": "settings_States",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/statesList",
                "name": "List States",
                "uniqueId": "settings_StatesList",
                "subMenuMappingId": "settings_States",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/editState",
                  "name": "Edit State",
                  "uniqueId": "settings_EditState",
                  "subMenuMappingId": "settings_States",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link": "/admin/settings/citiesList",
              "name": "Cities",
              "uniqueId": "settings_Cities",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/citiesList",
                "name": "List Cities",
                "uniqueId": "settings_CitiesList",
                "subMenuMappingId": "settings_Cities",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/editCity",
                  "name": "Edit City",
                  "uniqueId": "settings_EditCity",
                  "subMenuMappingId": "settings_Cities",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link": "/admin/settings/actionsAndStatusesList",
              "name": "Actions & Status",
              "uniqueId": "settings_Action_And_Status",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [
                {
                  "link": "/admin/settings/actionsAndStatusesList",
                  "name": "Action & Status",
                  "uniqueId": "settings_Action_And_Status_List",
                  "subMenuMappingId": "settings_Action_And_Status",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                },
                {
                  "link": "/admin/settings/actionsAndStatusesEdit",
                  "name": "Edit Action & Status",
                  "uniqueId": "settings_Action_And_Status_Edit",
                  "subMenuMappingId": "settings_Action_And_Status",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": "",
                  subMenu: [{
                    "link": "/admin/settings/actionsAndStatusesEdit",
                    "name": "Generic",
                    "uniqueId": "settings_Action_And_Status_Edit_Generic",
                    "subMenuMappingId": "settings_Action_And_Status_Edit",
                    "subMenusId": "settings",
                    "isLink": true,
                    "isMenu": true,
                    "image": ""
                  }]
                }]
            },
            // {
            //   "link": "/admin/settings/userTypeList",
            //   "name": "User Categories",
            //   "uniqueId": "settings_userTypes",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   subMenu: [
            //     {
            //       "link": "/admin/settings/addUserType",
            //       "name": "Add UserType",
            //       "uniqueId": "settings_AddUserType",
            //       "subMenuMappingId": "settings_userTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/userTypeList",
            //       "name": "List UserType",
            //       "uniqueId": "settings_UserTypeList",
            //       "subMenuMappingId": "settings_userTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editUserType",
            //       "name": "Edit UserType",
            //       "uniqueId": "settings_EditUserType",
            //       "subMenuMappingId": "settings_userTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            //
            // },
            {
              "link": "/admin/settings/transactionTypeList",
              "name": "Transaction Types",
              "uniqueId": "settings_transactionTypes",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addTransactionType",
                "name": "Add TransactionType",
                "uniqueId": "settings_AddTransactionType",
                "subMenuMappingId": "settings_transactionTypes",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/transactionTypeList",
                  "name": "List TransactionType",
                  "uniqueId": "settings_TransactionTypeList",
                  "subMenuMappingId": "settings_transactionTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editTransactionType",
                  "name": "Edit TransactionType",
                  "uniqueId": "settings_EditTransactionType",
                  "subMenuMappingId": "settings_transactionTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]

            },
            {
              "link": "/admin/settings/roleTypeList",
              "name": "Role Types",
              "uniqueId": "settings_roleTypes",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [
                {
                  "link": "/admin/settings/roleTypeList",
                  "name": "List RoleType",
                  "uniqueId": "settings_RoleTypeList",
                  "subMenuMappingId": "settings_roleTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editRoleType",
                  "name": "Edit RoleType",
                  "uniqueId": "settings_EditRoleType",
                  "subMenuMappingId": "settings_roleTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link": "/admin/settings/accountTypeList",
              "name": "Account Types",
              "uniqueId": "settings_templateTypes",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addAccountType",
                "name": "Add TemplateType",
                "uniqueId": "settings_AddTemplateType",
                "subMenuMappingId": "settings_templateTypes",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/accountTypeList",
                  "name": "List TemplateType",
                  "uniqueId": "settings_TemplateTypeList",
                  "subMenuMappingId": "settings_templateTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editAccountType",
                  "name": "Edit TemplateType",
                  "uniqueId": "settings_EditTemplateType",
                  "subMenuMappingId": "settings_templateTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            // {
            //   "link": "/admin/settings/documentTypeList",
            //   "name": "Document Types",
            //   "uniqueId": "settings_documentTypes",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   subMenu: [{
            //     "link": "/admin/settings/addDocumentType",
            //     "name": "Add Document Type",
            //     "uniqueId": "settings_AddDocumentType",
            //     "subMenuMappingId": "settings_documentTypes",
            //     "subMenusId": "settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/documentTypeList",
            //       "name": "List Document Type",
            //       "uniqueId": "settings_DocumentTypeList",
            //       "subMenuMappingId": "settings_documentTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editDocumentType",
            //       "name": "Edit Document Type",
            //       "uniqueId": "settings_EditDocumentType",
            //       "subMenuMappingId": "settings_documentTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            // {
            //   "link" : "/admin/settings/documentFormatList",
            //   "name" : "Document Format",
            //   "uniqueId" : "settings_documentFormats",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   subMenu:[{
            //     "link": "/admin/settings/addDocumentFormat",
            //     "name": "Add Document Format",
            //     "uniqueId": "settings_AddDocumentFormat",
            //     "subMenuMappingId":"settings_documentFormats",
            //     "subMenusId":"settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/documentFormatList",
            //       "name": "List Document Format",
            //       "uniqueId": "settings_DocumentFormatList",
            //       "subMenuMappingId":"settings_documentFormats",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editDocumentFormat",
            //       "name": "Edit Document Format",
            //       "uniqueId": "settings_EditDocumentFormat",
            //       "subMenuMappingId":"settings_documentFormats",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            {
              "link": "/admin/settings/documentProcess/kycCategoryList",
              "name": "Document Process",
              "uniqueId": "settings_documentProcess",
              "isLink": true,
              "isMenu": true,
              "image": "",
              "subMenusId": "settings",
              "subMenuMappingId": "settings_documentProcess",
              "subMenu": [{
                "link": "/admin/settings/documentProcess/kycCategoryList",
                "name": "KYC Category",
                "uniqueId": "settings_kycCategories",
                "isLink": true,
                "isMenu": true,
                "image": "",
                "subMenusId": "settings_documentProcess",
                "subMenuMappingId": "settings_kycCategories",
                subMenu: [{
                  "link": "/admin/settings/documentProcess/addKycCategory",
                  "name": "Add KYC Category",
                  "uniqueId": "settings_AddKycCategory",
                  "subMenuMappingId": "settings_kycCategories",
                  "subMenusId": "settings_documentProcess",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                  {
                    "link": "/admin/settings/documentProcess/kycCategoryList",
                    "name": "List KYC Categories",
                    "uniqueId": "settings_KycCategoryList",
                    "subMenuMappingId": "settings_kycCategories",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                  {
                    "link": "/admin/settings/documentProcess/editKycCategory",
                    "name": "Edit KYC Category",
                    "uniqueId": "settings_EditKycCategory",
                    "subMenuMappingId": "settings_kycCategories",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": true,
                    "image": ""
                  }
                ]
              },
                {
                  "link": "/admin/settings/documentProcess/documentFormatList",
                  "name": "Document Formats",
                  "uniqueId": "settings_documentFormats",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_kycCategories",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addDocumentFormat",
                    "name": "Add Document Format",
                    "uniqueId": "settings_AddDocumentFormat",
                    "subMenuMappingId": "settings_documentFormats",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/documentFormatList",
                      "name": "List Document Format",
                      "uniqueId": "settings_DocumentFormatList",
                      "subMenuMappingId": "settings_documentFormats",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editDocumentFormat",
                      "name": "Edit Document Format",
                      "uniqueId": "settings_EditDocumentFormat",
                      "subMenuMappingId": "settings_documentFormats",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/documentProcess/specificationList",
                  "name": "Specifications",
                  "uniqueId": "settings_specificationTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_specificationTypes",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addSpecification",
                    "name": "Add SpecificationType",
                    "uniqueId": "settings_AddSpecificationType",
                    "subMenuMappingId": "settings_specificationTypes",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/specificationList",
                      "name": "List SpecificationType",
                      "uniqueId": "settings_SpecificationTypeList",
                      "subMenuMappingId": "settings_specificationTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editSpecification",
                      "name": "Edit SpecificationType",
                      "uniqueId": "settings_EditSpecificationType",
                      "subMenuMappingId": "settings_specificationTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/documentProcess/industryList",
                  "name": "Industries",
                  "uniqueId": "settings_industryTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_industryTypes",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addIndustry",
                    "name": "Add IndustryType",
                    "uniqueId": "settings_AddIndustryType",
                    "subMenuMappingId": "settings_industryTypes",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/industryList",
                      "name": "List IndustryType",
                      "uniqueId": "settings_IndustryTypeList",
                      "subMenuMappingId": "settings_industryTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editIndustry",
                      "name": "Edit IndustryType",
                      "uniqueId": "settings_EditIndustryType",
                      "subMenuMappingId": "settings_industryTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/documentProcess/professionList",
                  "name": "Professions",
                  "uniqueId": "settings_professionTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_professionTypes",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addProfession",
                    "name": "Add ProfessionType",
                    "uniqueId": "settings_AddProfessionType",
                    "subMenuMappingId": "settings_professionTypes",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/professionList",
                      "name": "List ProfessionType",
                      "uniqueId": "settings_ProfessionTypeList",
                      "subMenuMappingId": "settings_professionTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editProfession",
                      "name": "Edit ProfessionType",
                      "uniqueId": "settings_EditProfessionType",
                      "subMenuMappingId": "settings_professionTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/documentProcess/documentTypeList",
                  "name": "Document Types",
                  "uniqueId": "settings_documentTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_documentTypes",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addDocumentType",
                    "name": "Add Document Type",
                    "uniqueId": "settings_AddDocumentType",
                    "subMenuMappingId": "settings_documentTypes",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/documentTypeList",
                      "name": "List Document Type",
                      "uniqueId": "settings_DocumentTypeList",
                      "subMenuMappingId": "settings_documentTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editDocumentType",
                      "name": "Edit Document Type",
                      "uniqueId": "settings_EditDocumentType",
                      "subMenuMappingId": "settings_documentTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/documentProcess/userTypeList",
                  "name": "User Categories",
                  "uniqueId": "settings_userTypes",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_userTypes",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addUserType",
                    "name": "Add UserType",
                    "uniqueId": "settings_AddUserType",
                    "subMenuMappingId": "settings_userTypes",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": true,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/userTypeList",
                      "name": "List UserType",
                      "uniqueId": "settings_UserTypeList",
                      "subMenuMappingId": "settings_userTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editUserType",
                      "name": "Edit UserType",
                      "uniqueId": "settings_EditUserType",
                      "subMenuMappingId": "settings_userTypes",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/documentProcess/subDomainList",
                  "name": "Sub Domains",
                  "uniqueId": "settings_SubDomain",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_userTypes",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addSubDomain",
                    "name": "Add Sub Domain",
                    "uniqueId": "settings_AddSubDomain",
                    "subMenuMappingId": "settings_SubDomain",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": true,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/SubDomainList",
                      "name": "List SubDomain",
                      "uniqueId": "settings_SubDomainList",
                      "subMenuMappingId": "settings_SubDomain",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editSubDomain",
                      "name": "Edit SubDomain",
                      "uniqueId": "settings_EditSubDomain",
                      "subMenuMappingId": "settings_SubDomain",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/documentProcess/documentMappingList",
                  "name": "Document Mapping",
                  "uniqueId": "settings_DocumentMapping",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_DocumentMapping",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addDocumentMapping",
                    "name": "Add Document Mapping",
                    "uniqueId": "settings_AddDocumentMapping",
                    "subMenuMappingId": "settings_DocumentMapping",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/documentMappingList",
                      "name": "List Document Mapping",
                      "uniqueId": "settings_DocumentMappingList",
                      "subMenuMappingId": "settings_DocumentMapping",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editDocumentMapping",
                      "name": "Edit Document Mapping",
                      "uniqueId": "settings_EditDocumentMapping",
                      "subMenuMappingId": "settings_DocumentMapping",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                },
                {
                  "link": "/admin/settings/documentProcess/processList",
                  "name": "Process Mapping",
                  "uniqueId": "settings_Process",
                  "isLink": true,
                  "isMenu": true,
                  "image": "",
                  "subMenusId": "settings_documentProcess",
                  "subMenuMappingId": "settings_Process",
                  subMenu: [{
                    "link": "/admin/settings/documentProcess/addProcess",
                    "name": "Add Process",
                    "uniqueId": "settings_addProcess",
                    "subMenuMappingId": "settings_Process",
                    "subMenusId": "settings_documentProcess",
                    "isLink": true,
                    "isMenu": false,
                    "image": ""
                  },
                    {
                      "link": "/admin/settings/documentProcess/processList",
                      "name": "List Process",
                      "uniqueId": "settings_processList",
                      "subMenuMappingId": "settings_Process",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": false,
                      "image": ""
                    },
                    {
                      "link": "/admin/settings/documentProcess/editProcess",
                      "name": "Edit Process",
                      "uniqueId": "settings_editProcess",
                      "subMenuMappingId": "settings_Process",
                      "subMenusId": "settings_documentProcess",
                      "isLink": true,
                      "isMenu": true,
                      "image": ""
                    }
                  ]
                }
              ]
            },

            // {
            //   "link" : "/admin/settings/kycCategoryList",
            //   "name" : "KYC Category",
            //   "uniqueId" : "settings_kycCategories",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   subMenu:[{
            //     "link": "/admin/settings/addKycCategory",
            //     "name": "Add KYC Category",
            //     "uniqueId": "settings_AddKycCategory",
            //     "subMenuMappingId":"settings_kycCategories",
            //     "subMenusId":"settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/kycCategoryList",
            //       "name": "List KYC Categories",
            //       "uniqueId": "settings_KycCategoryList",
            //       "subMenuMappingId":"settings_kycCategories",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editKycCategory",
            //       "name": "Edit KYC Category",
            //       "uniqueId": "settings_EditKycCategory",
            //       "subMenuMappingId":"settings_kycCategories",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            // {
            //   "link": "/admin/settings/documentMappingList",
            //   "name": "Document Mapping",
            //   "uniqueId": "settings_DocumentMapping",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   subMenu: [{
            //     "link": "/admin/settings/addDocumentMapping",
            //     "name": "Add Document Mapping",
            //     "uniqueId": "settings_AddDocumentMapping",
            //     "subMenuMappingId": "settings_DocumentMapping",
            //     "subMenusId": "settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/documentMappingList",
            //       "name": "List Document Mapping",
            //       "uniqueId": "settings_DocumentMappingList",
            //       "subMenuMappingId": "settings_DocumentMapping",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editDocumentMapping",
            //       "name": "Edit Document Mapping",
            //       "uniqueId": "settings_EditDocumentMapping",
            //       "subMenuMappingId": "settings_DocumentMapping",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            // {
            //   "link": "/admin/settings/industryList",
            //   "name": "Industry",
            //   "uniqueId": "settings_industryTypes",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   subMenu: [{
            //     "link": "/admin/settings/addIndustry",
            //     "name": "Add IndustryType",
            //     "uniqueId": "settings_AddIndustryType",
            //     "subMenuMappingId": "settings_industryTypes",
            //     "subMenusId": "settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/industryList",
            //       "name": "List IndustryType",
            //       "uniqueId": "settings_IndustryTypeList",
            //       "subMenuMappingId": "settings_industryTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editIndustry",
            //       "name": "Edit IndustryType",
            //       "uniqueId": "settings_EditIndustryType",
            //       "subMenuMappingId": "settings_industryTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            // {
            //   "link": "/admin/settings/specificationList",
            //   "name": "Specification",
            //   "uniqueId": "settings_specificationTypes",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   subMenu: [{
            //     "link": "/admin/settings/addSpecification",
            //     "name": "Add SpecificationType",
            //     "uniqueId": "settings_AddSpecificationType",
            //     "subMenuMappingId": "settings_specificationTypes",
            //     "subMenusId": "settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/specificationList",
            //       "name": "List SpecificationType",
            //       "uniqueId": "settings_SpecificationTypeList",
            //       "subMenuMappingId": "settings_specificationTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editSpecification",
            //       "name": "Edit SpecificationType",
            //       "uniqueId": "settings_EditSpecificationType",
            //       "subMenuMappingId": "settings_specificationTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            // {
            //   "link": "/admin/settings/professionList",
            //   "name": "Profession",
            //   "uniqueId": "settings_professionTypes",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   subMenu: [{
            //     "link": "/admin/settings/addProfession",
            //     "name": "Add ProfessionType",
            //     "uniqueId": "settings_AddProfessionType",
            //     "subMenuMappingId": "settings_professionTypes",
            //     "subMenusId": "settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/professionList",
            //       "name": "List ProfessionType",
            //       "uniqueId": "settings_ProfessionTypeList",
            //       "subMenuMappingId": "settings_professionTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editProfession",
            //       "name": "Edit ProfessionType",
            //       "uniqueId": "settings_EditProfessionType",
            //       "subMenuMappingId": "settings_professionTypes",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },

            // {
            //   "link" : "/admin/settings/businessList",
            //   "name" : "Business Types",
            //   "uniqueId" : "settings_businessTypes",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   subMenu:[{
            //     "link": "/admin/settings/addBusiness",
            //     "name": "Add BusinessType",
            //     "uniqueId": "settings_AddBusinessType",
            //     "subMenuMappingId":"settings_businessTypes",
            //     "subMenusId":"settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/businessList",
            //       "name": "List BusinessType",
            //       "uniqueId": "settings_BusinessTypeList",
            //       "subMenuMappingId":"settings_businessTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editBusiness",
            //       "name": "Edit BusinessType",
            //       "uniqueId": "settings_EditBusinessType",
            //       "subMenuMappingId":"settings_businessTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            // {
            //   "link" : "/admin/settings/citizenshipList",
            //   "name" : "Citizenship",
            //   "uniqueId" : "settings_citizenshipTypes",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   subMenu:[{
            //     "link": "/admin/settings/addCitizenship",
            //     "name": "Add CitizenshipType",
            //     "uniqueId": "settings_AddCitizenshipType",
            //     "subMenuMappingId":"settings_citizenshipTypes",
            //     "subMenusId":"settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/citizenshipList",
            //       "name": "List CitizenshipType",
            //       "uniqueId": "settings_CitizenshipTypeList",
            //       "subMenuMappingId":"settings_citizenshipTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editCitizenship",
            //       "name": "Edit CitizenshipType",
            //       "uniqueId": "settings_EditCitizenshipType",
            //       "subMenuMappingId":"settings_citizenshipTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            // {
            //   "link" : "/admin/settings/lookingForList",
            //   "name" : "Looking For",
            //   "uniqueId" : "settings_lookingForTypes",
            //   "isLink" : true,
            //   "isMenu" : true,
            //   "image" : "",
            //   subMenu:[{
            //     "link": "/admin/settings/addLookingFor",
            //     "name": "Add LookingForType",
            //     "uniqueId": "settings_AddLookingForType",
            //     "subMenuMappingId":"settings_lookingForTypes",
            //     "subMenusId":"settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/lookingForList",
            //       "name": "List LookingForType",
            //       "uniqueId": "settings_LookingForTypeList",
            //       "subMenuMappingId":"settings_lookingForTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editLookingFor",
            //       "name": "Edit LookingForType",
            //       "uniqueId": "settings_EditLookingForType",
            //       "subMenuMappingId":"settings_lookingForTypes",
            //       "subMenusId":"settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },

            {
              "link": "/admin/settings/assetsList",
              "name": "Assets",
              "uniqueId": "settings_assets",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addassets",
                "name": "Add assets",
                "uniqueId": "settings_Addassets",
                "subMenuMappingId": "settings_assets",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": true,
                "image": ""
              },
                {
                  "link": "/admin/settings/assetsList",
                  "name": "List Assets",
                  "uniqueId": "settings_assetsList",
                  "subMenuMappingId": "settings_assets",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editassets",
                  "name": "Edit Assets",
                  "uniqueId": "settings_Editassets",
                  "subMenuMappingId": "settings_assets",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link": "/admin/settings/awardList",
              "name": "Awards",
              "uniqueId": "settings_awardTypes",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addAward",
                "name": "Add AwardType",
                "uniqueId": "settings_AddAwardType",
                "subMenuMappingId": "settings_awardTypes",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": false,
                "image": ""
              },
                {
                  "link": "/admin/settings/awardList",
                  "name": "List AwardType",
                  "uniqueId": "settings_AwardTypeList",
                  "subMenuMappingId": "settings_awardTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editAward",
                  "name": "Edit AwardType",
                  "uniqueId": "settings_EditAwardType",
                  "subMenuMappingId": "settings_awardTypes",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            {
              "link": "/admin/settings/technologiesList",
              "name": "Technologies",
              "uniqueId": "settings_technologies",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addTechnology",
                "name": "Add Technology",
                "uniqueId": "settings_AddTechnology",
                "subMenuMappingId": "settings_technologies",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": true,
                "image": ""
              },
                {
                  "link": "/admin/settings/technologiesList",
                  "name": "List Technologies",
                  "uniqueId": "settings_technologiesList",
                  "subMenuMappingId": "settings_technologies",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                },
                {
                  "link": "/admin/settings/edittechnology",
                  "name": "Edit Technology",
                  "uniqueId": "settings_Edittechnology",
                  "subMenuMappingId": "settings_technologies",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },
            // {
            //   "link": "/admin/settings/subDomainList",
            //   "name": "Sub Domain",
            //   "uniqueId": "settings_SubDomain",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   subMenu: [{
            //     "link": "/admin/settings/addSubDomain",
            //     "name": "Add Sub Domain",
            //     "uniqueId": "settings_AddSubDomain",
            //     "subMenuMappingId": "settings_SubDomain",
            //     "subMenusId": "settings",
            //     "isLink": true,
            //     "isMenu": true,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/SubDomainList",
            //       "name": "List SubDomain",
            //       "uniqueId": "settings_SubDomainList",
            //       "subMenuMappingId": "settings_SubDomain",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editSubDomain",
            //       "name": "Edit SubDomain",
            //       "uniqueId": "settings_EditSubDomain",
            //       "subMenuMappingId": "settings_SubDomain",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            {
              "link": "/admin/settings/fundingTypeList",
              "name": "Types Of Funding",
              "uniqueId": "settings_FundingType",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addFundingType",
                "name": "Add Funding Type",
                "uniqueId": "settings_AddFundingType",
                "subMenuMappingId": "settings_FundingType",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": true,
                "image": ""
              },
                {
                  "link": "/admin/settings/fundingTypeList",
                  "name": "List Funding Types",
                  "uniqueId": "settings_FundingTypeList",
                  "subMenuMappingId": "settings_FundingType",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editFundingType",
                  "name": "Edit Funding Type",
                  "uniqueId": "settings_EditFundingType",
                  "subMenuMappingId": "settings_FundingType",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            },

            // {
            //   "link": "/admin/settings/processList",
            //   "name": "Process Mapping",
            //   "uniqueId": "settings_Process",
            //   "isLink": true,
            //   "isMenu": true,
            //   "image": "",
            //   subMenu: [{
            //     "link": "/admin/settings/addProcess",
            //     "name": "Add Process",
            //     "uniqueId": "settings_addProcess",
            //     "subMenuMappingId": "settings_Process",
            //     "subMenusId": "settings",
            //     "isLink": true,
            //     "isMenu": false,
            //     "image": ""
            //   },
            //     {
            //       "link": "/admin/settings/processList",
            //       "name": "List Process",
            //       "uniqueId": "settings_processList",
            //       "subMenuMappingId": "settings_Process",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": false,
            //       "image": ""
            //     },
            //     {
            //       "link": "/admin/settings/editProcess",
            //       "name": "Edit Process",
            //       "uniqueId": "settings_editProcess",
            //       "subMenuMappingId": "settings_Process",
            //       "subMenusId": "settings",
            //       "isLink": true,
            //       "isMenu": true,
            //       "image": ""
            //     }]
            // },
            {
              "link": "/admin/settings/history",
              "name": "History",
              "uniqueId": "settings_history",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [
                {
                  "link": "/admin/settings/history",
                  "name": "History List",
                  "uniqueId": "settings_historyList",
                  "subMenuMappingId": "settings_history",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": false,
                  "image": ""
                },
              ]
            },
            {
              "link": "/admin/settings/notificationTemplateList",
              "name": "Notification Templates",
              "uniqueId": "settings_NotificationTemplate",
              "isLink": true,
              "isMenu": true,
              "image": "",
              subMenu: [{
                "link": "/admin/settings/addNotificationTemplate",
                "name": "Add Notification Template",
                "uniqueId": "settings_AddNotificationTemplate",
                "subMenuMappingId": "settings_NotificationTemplate",
                "subMenusId": "settings",
                "isLink": true,
                "isMenu": true,
                "image": ""
              },
                {
                  "link": "/admin/settings/notificationTemplateList",
                  "name": "List Notification Templates",
                  "uniqueId": "settings_NotificationTemplateList",
                  "subMenuMappingId": "settings_NotificationTemplate",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                },
                {
                  "link": "/admin/settings/editNotificationTemplate",
                  "name": "Edit Notification Template",
                  "uniqueId": "settings_EditNotificationTemplate",
                  "subMenuMappingId": "settings_NotificationTemplate",
                  "subMenusId": "settings",
                  "isLink": true,
                  "isMenu": true,
                  "image": ""
                }]
            }

              // subMenu: [
              //   {
              //     "link": "/admin/settings/history",
              //     "name": "History List",
              //     "uniqueId": "settings_historyList",
              //     "subMenuMappingId": "settings_history",
              //     "subMenusId": "settings",
              //     "isLink": true,
              //     "isMenu": false,
              //     "image": ""
              //   }]

          ]
        }
      ]
    }
  });
}
