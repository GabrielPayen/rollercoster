import gpxpy
import geopandas as gpd
import matplotlib.pyplot as plt
import folium
import os,sys
from geopy.distance import geodesic
from datetime import datetime, timedelta
import numpy as np
from sklearn.linear_model import LinearRegression
import piecewise_regression
import scipy
from matplotlib.widgets import RectangleSelector

def open_gpx_file(file_path):
    try:
        with open(file_path, 'r') as gpx_file:
            gpx = gpxpy.parse(gpx_file)
            return gpx
    except FileNotFoundError:
        print("File not found!")
    except gpxpy.gpx.GPXException as e:
        print("Error parsing GPX file:", e)
    except Exception as e:
        print("An unexpected error occurred:", e)

def plot_gpx_track(gpx_data):
    track_points = []
    for track in gpx_data.tracks:
        for segment in track.segments:
            for point in segment.points:
                track_points.append([point.longitude, point.latitude])
    gdf = gpd.GeoDataFrame(geometry=gpd.points_from_xy(*zip(*track_points)))
    world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
    fig, ax = plt.subplots(figsize=(10, 6))
    world.plot(ax=ax, color='lightgray')
    gdf.plot(ax=ax, marker='o', color='red', markersize=5)
    ax.set_title('GPX Track')
    ax.set_xlabel('Longitude')
    ax.set_ylabel('Latitude')
    plt.show()

import numpy as np

def plot_elevation_profile(elevations, distances, slope_angles, ascentionnal_speeds):
    # Categorize slope angles
    categories = ['Descent', '0-10°', '10-20°', '20-30°', '30-40°', '>40°']
    colors = ['lightgray', 'lightgreen', 'lightblue', 'lightyellow', 'lightsalmon', 'lightcoral']
    category_colors = [colors[0]] * len(distances)  # Initialize category_colors with default color for all elements
    for i, angle in enumerate(slope_angles):
        if angle < 0:
            category_colors[i] = colors[0]  # Descent category
        elif angle < 10:
            category_colors[i] = '#ff6666'  # Light red shade for 0-10°
        elif angle < 20:
            category_colors[i] = '#ff3333'  # Medium red shade for 10-20°
        elif angle < 30:
            category_colors[i] = '#ff0000'  # Dark red shade for 20-30°
        elif angle < 40:
            category_colors[i] = '#990000'  # Darker red shade for 30-40°
        else:
            category_colors[i] = '#660000'  # Darkest red shade for >40°

    fig, ax1 = plt.subplots(figsize=(10, 6))

    ax1.fill_between(distances, min(elevations), max(elevations), where=np.array(category_colors) == colors[0], color=colors[0])
    for i in range(1, len(categories)):
        ax1.fill_between(distances, min(elevations), max(elevations), where=np.array(category_colors) == colors[i], color=colors[i])
    
    ax1.set_xlabel('Distance (m)')
    ax1.set_ylabel('Elevation (m)')
    ax1.legend(loc='upper left')

    
   
    ascentionnal_speeds_m_h = ascentionnal_speeds*3600

    # Create a secondary y-axis for ascentionnal speed
    ax2 = ax1.twinx()

    # Define the Gaussian kernel for smoothing
    kernel_size = 51  # Adjust the size as needed
    sigma = 10  # Adjust the sigma value for desired smoothing
    kernel = np.exp(-(np.arange(kernel_size) - kernel_size // 2)**2 / (2 * sigma**2))
    kernel /= np.sum(kernel)  # Normalize the kernel to sum to 1
    kernel = np.ones(10) / 10

    # Apply the convolution to smooth the ascentionnal speeds
    smoothed_speeds = np.convolve(ascentionnal_speeds_m_h, kernel, mode='same')

     # Separate negative/positive v-speeds
    mask = smoothed_speeds>0
    ascentionnal_speeds_pos = ascentionnal_speeds[mask] 

    #ax2.plot(distances[mask], ascentionnal_speeds_pos, color='blue', linestyle='--', label='Ascentionnal Speed')
    #ax2.plot(distances, ascentionnal_speeds_m_h, color='blue', linestyle='--', label='Ascentionnal Speed')
    ax2.plot(distances[mask], smoothed_speeds[mask], 'o', markersize=2,color='blue', label='Ascentionnal Speed')
    ax2.set_ylabel('Ascentionnal Speed (m/h)')
    ax2.legend(loc='upper right')
    ax2.set_ylim(-4000, 5000)

    ax1.plot(distances, elevations, color='black', label='Elevation')  # Plot elevation profile

    plt.grid(True)
    plt.show()


def plot_3d_gpx(gpx_data):
    latitudes = []
    longitudes = []
    elevations = []
    for track in gpx_data:
        for segment in track.segments:
            for point in segment.points:
                latitudes.append(point.latitude)
                longitudes.append(point.longitude)
                elevations.append(point.elevation)

    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection='3d')
    ax.scatter(latitudes, longitudes, elevations, c='b', marker='o')
    
    ax.set_xlabel('Latitude')
    ax.set_ylabel('Longitude')
    ax.set_zlabel('Elevation')
    
    plt.title('3D Plot of GPX Data')
    plt.show()

# Function to handle rectangle selection
    




def update_right_plot(x1, x2, y1, y2,axs):
    axs[1].clear()  # Clear previous plot
    axs[1].set_title('Selected Area')
    axs[1].text(0.5, 0.9, f'x1={x1:.2f}, x2={x2:.2f}, y1={y1:.2f}, y2={y2:.2f}', ha='center', va='center', transform=axs[1].transAxes)
    axs[1].set_axis_off()
    plt.draw()



def add_artificial_time(gpx_data):
    total_time = timedelta(hours=15)  # Total duration of the track (15 hours)
    num_points = sum(len(segment.points) for track in gpx_data.tracks for segment in track.segments)
    time_increment = total_time.total_seconds() / num_points

    start_time = datetime.now()
    current_time = start_time
    for track in gpx_data.tracks:
        for segment in track.segments:
            for point in segment.points:
                point.time = current_time
                current_time += timedelta(seconds=time_increment)

def get_distances_times_elevation(gpx_data,n):

    points = gpx_data.tracks[0].segments[0].points
    distances = []
    times = []
    elevations = []
    previous_point = None
    for point in points :
        
        if previous_point is not None :
            distance = point.distance_3d(previous_point)
            time = (point.time - previous_point.time).total_seconds()
            elevation = point.elevation - previous_point.elevation

            distances.append(distance)
            times.append(time)
            elevations.append(elevation)

        previous_point = point

    distances = np.array(distances[0:n])
    times = np.array(times[0:n])
    elevations = np.array(elevations[0:n])

    return distances,times,elevations


def get_ascentional_speeds(elevations,times):


    return elevations/times

def get_slopes_angles(distances,elevations):

    return np.arcsin(elevations/distances)*180/np.pi

def piecewise_linear_regression(altitude_profile):
    num_points = len(altitude_profile)

    x = np.arange(num_points)
    y = altitude_profile
    max_peaks,_ = scipy.signal.find_peaks(y, height=None, threshold=None, distance=100, prominence=50, width=None, wlen=None, rel_height=0.5, plateau_size=None)
    min_peaks,_ = scipy.signal.find_peaks(-y, height=None, threshold=None, distance=100, prominence=50, width=None, wlen=None, rel_height=0.5, plateau_size=None)

    plt.plot(y)
    plt.plot(min_peaks, y[min_peaks], "x")
    plt.plot(max_peaks, y[max_peaks], "x")
    
    models = piecewise_regression.ModelSelection(x, y, max_breakpoints=5)



   
    return y_pred





def plot_ascentionnal_speed(distances, ascentionnal_speeds):
    plt.figure(figsize=(10, 6))
    plt.plot(distances[:len(ascentionnal_speeds)], ascentionnal_speeds)  # Trim distances array to match ascentionnal_speeds length
    plt.title('Ascentionnal Speed over Distance')
    plt.xlabel('Distance (m)')
    plt.ylabel('Ascentionnal Speed (m/s)')
    plt.grid(True)
    plt.show()       

def plot_distances_segments(distances):
    plt.figure(figsize=(10, 6))

    plt.title('Segments distasmooth_elevationnces')
    plt.xlabel('GPX samples')
    plt.ylabel('Sample to sample distance (m)')
    plt.show()

def plot_on_map_folium(gpx_data):
    map_center = [gpx_data.tracks[0].segments[0].points[0].latitude, gpx_data.tracks[0].segments[0].points[0].longitude]
    m = folium.Map(location=map_center, zoom_start=13)
    folium.PolyLine([(point.latitude, point.longitude) for point in gpx_data.tracks[0].segments[0].points], color="red", weight=2.5, opacity=1).add_to(m)
    m.save('map.html')
    print("Map saved as map.htsmooth_elevationml. Open in a web browser to view.")

if __name__ == "__main__":
    file_path = os.path.join('data','cham_zermatt.gpx')
    gpx_data = open_gpx_file(file_path)
    if gpx_data:
        add_artificial_time(gpx_data)

        n = 27000
        distances,times,elevations = get_distances_times_elevation(gpx_data,n)

    
        total_distance = np.cumsum(distances)
        total_elevation = np.cumsum(elevations)

        def onselect(eclick, erelease):
            # Get the indices of selected data
            indmin = np.searchsorted(total_distance, (min(eclick.xdata, erelease.xdata),))
            indmax = np.searchsorted(total_distance, (max(eclick.xdata, erelease.xdata),))
            indmin = max(0, indmin[0] - 1)
            indmax = min(len(total_distance) - 1, indmax[0] + 1)

            ascent = total_elevation[indmax]- total_elevation[indmin]
            ascent_speed = 3600*ascent / ((indmax - indmin)*(times[indmax]))
            title = f"Ascent = {np.round(ascent)} | Ascent speed = {np.round(ascent_speed)}"
            # Update the right panel with selected data
            ax1.plot(total_distance[indmin:indmax], total_elevation[indmin:indmax],'r')


            ax2.clear()
            ax2.plot(total_distance[indmin:indmax], total_elevation[indmin:indmax])
            ax2.set_xlim(total_distance[indmin], total_distance[indmax])
            ax2.set_ylim(min(total_elevation[indmin:indmax]), max(total_elevation[indmin:indmax]))
            ax2.set_title(title)

            # Redraw the figure
            plt.draw()

            
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 5))

        # Plot x, y data on the left subplot
        ax1.plot(total_distance, total_elevation)
        ax1.set_title('Interactive profile')
        ax1.set_xlabel('Distance (m)')
        ax1.set_ylabel('Altitude (m)')

        # Enable rectangle selector on the left subplot
        rs = RectangleSelector(ax1, onselect, interactive=True)


        plt.show()

        #breakpoints = piecewise_linear_regression(total_elevation)
  
        #plot_piecewise(breakpoints,total_distance)
        vz = get_ascentional_speeds(elevations,times)

        theta = get_slopes_angles(distances,elevations)


        #plot_gpx_track(gpx_data)
        plot_elevation_profile(total_elevation,total_distance,theta,vz)
        plot_distances_segments(distances)
        
        #plot_3d_gpx(gpx_data)
        #plot_on_map_folium(gpx_data)
        
    else:
        print("Failed to load GPX file:", file_path)
