import gpxParser from "gpxparser"
import { format } from "date-fns"

export const parseGPX = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const gpx = new gpxParser()
        gpx.parse(event.target.result)

        const title = gpx.tracks[0].name
        const points = gpx.tracks[0].points
        const distance = gpx.tracks[0].distance.total / 1000 // Distance in kilometers

        const date = points[0].time.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })

        const duration =
          (points[points.length - 1].time - points[0].time) / 1000 / 60

        const distanceData = calculateDistance(points)
        
        const elevationData = points.map((point,idx) => ({
          time: point.time,
          elevation: point.ele,
          distance: distanceData[idx]
        }))

     
      const elevationSpeedData = movingAverage(calculateElevationSpeed(points), "elevationSpeed", 30)
        .map((data, idx) => ({ ...data, distance: distanceData[idx] }));
      
      const speedData = movingAverage(calculateSpeed(points), "speed", 30)
        .map((data, idx) => ({ ...data, distance: distanceData[idx] }));
      
      const paceData = movingAverage(calculatePace(points), "pace", 30)
        .map((data, idx) => ({ ...data, distance: distanceData[idx] }));
      
        const averageSpeed = distance / (duration / 60)

        const minElevation = gpx.tracks[0].elevation.min
        const maxElevation = gpx.tracks[0].elevation.max
        const posElevation = gpx.tracks[0].elevation.pos

        resolve({
          date,
          title,
          distance,
          duration,
          distanceData,
          elevationData,
          elevationSpeedData,
          speedData,
          paceData,
          averageSpeed,
          minElevation,
          maxElevation,
          posElevation,
          fileName: file.name
        })
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading the GPX file."))
    }

    reader.readAsText(file)
  })
}

function calculatePace(points) {
  const paceData = []
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const currPoint = points[i]

    const time1 = new Date(prevPoint.time)
    const time2 = new Date(currPoint.time)
    const timeDifference = (time2 - time1) / 1000 / 60 // Time difference in minutes

    const distance = getDistance(
      [prevPoint.lat, prevPoint.lon],
      [currPoint.lat, currPoint.lon]
    ) // Distance in kilometers

    const minDistance = 0.001 // 1 meter

    if (timeDifference > 0 && distance > minDistance) {
      let pace = timeDifference / distance

      if (pace > 300) continue // Ignore pace > 300 min/km

      paceData.push({
        time: currPoint.time,
        pace
      })
    }
  }
  return paceData
}

function calculateElevationSpeed(points) {
  const elevationSpeedData = []
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const currPoint = points[i]

    const time1 = new Date(prevPoint.time)
    const time2 = new Date(currPoint.time)
    const timeDifference = ((time2 - time1) / 1000) // Time difference in s

    const elevationDifference = (currPoint.ele - prevPoint.ele ) // Elevation difference in meters

    const elevationSpeed = elevationDifference * 60 * 60 / timeDifference // Elevation speed in m/h

    elevationSpeedData.push({
      time: currPoint.time,
      elevationSpeed
    })
  }
  return elevationSpeedData
}

function calculateDistance(points) {
  const distanceData = []
  let totalDistance = 0

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const currPoint = points[i]

    const distance = getDistance(
      [prevPoint.lat, prevPoint.lon],
      [currPoint.lat, currPoint.lon]
    ) // Distance in kilometers

    totalDistance += distance

    distanceData.push({
      time: currPoint.time,
      distance: totalDistance
    })
  }

  return distanceData
}

function calculateSpeed(points) {
  const speedData = []
  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const currPoint = points[i]

    const time1 = new Date(prevPoint.time)
    const time2 = new Date(currPoint.time)
    const timeDifference = ((time2 - time1) / 1000) * 60 * 60 // Time difference in minutes

    const distance = getDistance(
      [prevPoint.lat, prevPoint.lon],
      [currPoint.lat, currPoint.lon]
    ) // Distance in kilometers

    const speed = distance * timeDifference // Speed in km/h

    if (speed < 1000) {
      speedData.push({
        time: currPoint.time,
        speed
      })
    }
  }
  return speedData
}

function getDistance(point1, point2) {
  const [lat1, lon1] = point1
  const [lat2, lon2] = point2

  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}


function movingAverage(data, valueKey, windowSize) {
  const result = []
  for (let i = 0; i < data.length - windowSize + 1; i++) {
    const windowData = data.slice(i, i + windowSize)
    const average =
      windowData.reduce((sum, value) => sum + value[valueKey], 0) / windowSize
    result.push({
      time: windowData[windowSize - 1].time,
      [valueKey]: parseFloat(average.toFixed(2))
    })
  }
  return result
}
