from IPython.display import display
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.widgets import RectangleSelector
import ipywidgets as widgets

# Sample data: y = sin(x) for x in [0, 2*pi]
x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x)

fig, ax = plt.subplots()
ax.plot(x, y)

# Placeholder for the mean value text display
mean_value_display = widgets.Label()
display(mean_value_display)

def onselect(eclick, erelease):
    'Function to calculate and display mean value of selected region'
    x1, y1 = eclick.xdata, eclick.ydata
    x2, y2 = erelease.xdata, erelease.ydata
    
    # Select data within the rectangle
    selected = (x >= min(x1, x2)) & (x <= max(x1, x2)) & (y >= min(y1, y2)) & (y <= max(y1, y2))
    
    # Calculate mean value
    if any(selected):
        mean_value = y[selected].mean()
        mean_value_display.value = f'Mean value: {mean_value:.2f}'
    else:
        mean_value_display.value = 'Select a region within the plot.'

# Enable rectangle selector on the plot
toggle_selector = RectangleSelector(ax, onselect,  useblit=True,
                                    button=[1],  # Left mouse button
                                    minspanx=5, minspany=5,
                                    spancoords='pixels',
                                    interactive=True)

plt.show()