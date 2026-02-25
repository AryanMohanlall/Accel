"use client";

import React from 'react';
import { useUserState } from '../../providers/userProvider'; // Assuming this holds your data

const Dashboard = () => {
  //const { styles } = useStyles();
  const data = 
  {
    "opportunities": {
        "totalCount": 1,
        "activeCount": 1,
        "wonCount": 0,
        "lostCount": 0,
        "totalValue": 250000.00,
        "wonValue": 0,
        "pipelineValue": 250000.00,
        "winRate": 0,
        "averageDealSize": 0,
        "averageSalesCycle": 0
    },
    "pipeline": {
        "stages": [
            {
                "stage": 1,
                "stageName": "Lead",
                "count": 1,
                "totalValue": 250000.00,
                "averageProbability": 75,
                "conversionToNext": 0
            },
            {
                "stage": 2,
                "stageName": "Qualified",
                "count": 0,
                "totalValue": 0,
                "averageProbability": 0,
                "conversionToNext": 0
            },
            {
                "stage": 3,
                "stageName": "Proposal",
                "count": 0,
                "totalValue": 0,
                "averageProbability": 0,
                "conversionToNext": 0
            },
            {
                "stage": 4,
                "stageName": "Negotiation",
                "count": 0,
                "totalValue": 0,
                "averageProbability": 0,
                "conversionToNext": 0
            },
            {
                "stage": 5,
                "stageName": "ClosedWon",
                "count": 0,
                "totalValue": 0,
                "averageProbability": 0,
                "conversionToNext": 0
            },
            {
                "stage": 6,
                "stageName": "ClosedLost",
                "count": 0,
                "totalValue": 0,
                "averageProbability": 0,
                "conversionToNext": 0
            }
        ],
        "conversionRate": 0,
        "weightedPipelineValue": 187500.0000
    },
    "activities": {
        "totalCount": 1,
        "upcomingCount": 0,
        "overdueCount": 0,
        "completedTodayCount": 0,
        "completedThisWeekCount": 1,
        "byType": {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 1,
            "5": 0
        }
    },
    "contracts": {
        "totalActiveCount": 1,
        "expiringThisMonthCount": 0,
        "expiringThisQuarterCount": 0,
        "totalContractValue": 15000.00,
        "averageContractValue": 15000.00
    },
    "revenue": {
        "thisMonth": 0,
        "thisQuarter": 0,
        "thisYear": 0,
        "projectedThisMonth": 0,
        "projectedThisQuarter": 0,
        "projectedThisYear": 187500.0000,
        "monthlyTrend": [
            {
                "year": 2026,
                "month": 1,
                "monthName": "January 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 2,
                "monthName": "February 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 3,
                "monthName": "March 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 4,
                "monthName": "April 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 5,
                "monthName": "May 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 6,
                "monthName": "June 2026",
                "actual": 0,
                "projected": 187500.0000
            },
            {
                "year": 2026,
                "month": 7,
                "monthName": "July 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 8,
                "monthName": "August 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 9,
                "monthName": "September 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 10,
                "monthName": "October 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 11,
                "monthName": "November 2026",
                "actual": 0,
                "projected": 0
            },
            {
                "year": 2026,
                "month": 12,
                "monthName": "December 2026",
                "actual": 0,
                "projected": 0
            }
        ]
    }
};

  // Fallback data based on your expected response
  const pipeline = data?.pipeline?.stages || [];
  const revenue = data?.revenue || {};
  const user = data?.user || { firstName: "User" };

  return (
    <div /* className={styles.container} */>

    </div>
  );
};

export default Dashboard;