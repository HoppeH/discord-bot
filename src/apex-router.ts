// /****** Script for SelectTopNRows command from SSMS  ******/
// SELECT [ID]
//       ,[LoggTime]
//       ,[PlayerName]
//       ,[LoggValue]
//       ,[LoggParameter]
//       ,[LoggCategory]
//       ,[LegendName]
//   FROM [dbo].[ApexStatsLogg]

//   WHERE LoggTime>=DateADD(mi, -10, Current_TimeStamp)
//   AND LoggParameter='level'
//   AND LoggCategory='account'
//   ORDER BY LoggValue DESC
