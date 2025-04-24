'use strict';

console.log('Grade Average Calculator: Script loaded');

let subjectAverages = [];

function getOrCreateAverageSpan(subjectNameCell) {
    let averageSpan = subjectNameCell.querySelector('[data-grade-average="true"]');

    if (!averageSpan) {
        averageSpan = document.createElement('span');
        averageSpan.setAttribute('data-grade-average', 'true');
        averageSpan.style.color = 'rgb(27, 142, 39)';
        averageSpan.style.fontWeight = 'bold';
        averageSpan.style.marginRight = '10px';

        const subjectNameDiv = subjectNameCell.querySelector('div');
        if (subjectNameDiv) {
            subjectNameDiv.insertBefore(averageSpan, subjectNameDiv.firstChild);
        } else {
            console.warn('No subject div found to insert average span');
        }
    }

    return averageSpan;
}

function getOrCreateButtonsContainer(subjectNameCell) {
    let buttonsContainer = subjectNameCell.querySelector('.grade-average-buttons');
    
    if (!buttonsContainer) {
        buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'grade-average-buttons';
        buttonsContainer.style.marginTop = '5px';
        buttonsContainer.style.display = 'block';
        
        const subjectNameDiv = subjectNameCell.querySelector('div');
        if (subjectNameDiv) {
            subjectNameCell.insertBefore(buttonsContainer, subjectNameDiv.nextSibling);
        } else {
            subjectNameCell.appendChild(buttonsContainer);
        }
    }
    
    return buttonsContainer;
}

function calculateAverages() {
    subjectAverages = [];
    const subjectRows = document.querySelectorAll('tr.naglowek3');

    subjectRows.forEach((row) => {
        try {
            const subjectNameCell = row.querySelector('td:first-child');
            const gradesCell = row.querySelector('td:nth-child(2)');

            if (!subjectNameCell || !gradesCell) {
                return;
            }

            if (!gradesCell.textContent.trim()) {
                return;
            }

            const subjectName = subjectNameCell.textContent.trim();
            const gradeLinks = gradesCell.querySelectorAll('a.info');

            if (gradeLinks.length === 0) {
                return;
            }

            const gradeEntries = [];
            let totalWeightedValue = 0;
            let totalWeight = 0;

            gradeLinks.forEach(gradeLink => {
                const infoSpan = gradeLink.querySelector('span');

                if (!infoSpan) {
                    return;
                }

                const valueMatch = infoSpan.innerHTML.match(/Wartość oceny: <strong>([0-9.]+)<\/strong>/);
                if (!valueMatch) {
                    return;
                }

                const gradeValue = parseFloat(valueMatch[1]);

                if (gradeValue === 0) {
                    return;
                }

                const countsTowardsAverage = infoSpan.innerHTML.includes('Liczona do średniej: <strong>tak');

                if (!countsTowardsAverage) {
                    return;
                }

                const weightMatch = infoSpan.innerHTML.match(/Waga: <strong>.*?<small>\(([0-9]+)\)<\/small>/);
                if (!weightMatch) {
                    return;
                }

                const weight = parseInt(weightMatch[1], 10);

                if (weight === 0) {
                    return;
                }

                const dateMatch = infoSpan.innerHTML.match(/Wpisano: <strong>([^<]+)<\/strong>/);
                let date = new Date();
                
                if (dateMatch) {
                    const dateStr = dateMatch[1];
                    const dateParts = dateStr.split(', ');
                    if (dateParts.length >= 2) {
                        const datePortion = dateParts[1];
                        try {
                            const [day, monthName, year] = datePortion.split(' ');
                            const months = {
                                'stycznia': 0, 'lutego': 1, 'marca': 2, 'kwietnia': 3,
                                'maja': 4, 'czerwca': 5, 'lipca': 6, 'sierpnia': 7,
                                'września': 8, 'października': 9, 'listopada': 10, 'grudnia': 11
                            };
                            const month = months[monthName];
                            date = new Date(parseInt(year), month, parseInt(day));
                        } catch (e) {
                        }
                    }
                }

                totalWeightedValue += gradeValue * weight;
                totalWeight += weight;

                gradeEntries.push({
                    value: gradeValue,
                    weight: weight,
                    date: date
                });
            });

            if (totalWeight > 0) {
                const average = totalWeightedValue / totalWeight;
                const formattedAverage = average.toFixed(2);

                subjectAverages.push({
                    subject: subjectName,
                    average: average
                });

                const averageSpan = getOrCreateAverageSpan(subjectNameCell);
                averageSpan.textContent = `[${formattedAverage}]`;

                addSimulationUI(subjectNameCell, totalWeightedValue, totalWeight, average);

                if (gradeEntries.length >= 2) {
                    addGraphUI(row, subjectName, gradeEntries);
                }
            } else {
                const averageSpan = getOrCreateAverageSpan(subjectNameCell);
                averageSpan.textContent = '[0]';

                addSimulationUI(subjectNameCell, 0, 0, 0);
            }
        } catch (error) {
        }
    });

    displayTotalAverage(subjectRows);
}

function displayTotalAverage(subjectRows) {
    if (subjectAverages.length === 0) {
        return;
    }
    
    document.querySelectorAll('.total-average-row').forEach(el => el.remove());
    
    const totalSum = subjectAverages.reduce((sum, subject) => sum + subject.average, 0);
    const totalAverage = totalSum / subjectAverages.length;
    const formattedTotalAverage = totalAverage.toFixed(2);
    
    const table = subjectRows[0].closest('table');
    if (!table) return;
    
    let averageColor = '#1b8e27';
    if (totalAverage < 2.0) {
        averageColor = '#e63946';
    } else if (totalAverage < 3.0) {
        averageColor = '#fd7e14';
    } else if (totalAverage < 3.5) {
        averageColor = '#ffc107';
    }
    
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-average-row';
    
    const numColumns = table.rows[0].cells.length;
    
    const totalCell = document.createElement('td');
    totalCell.colSpan = numColumns;
    totalCell.style.padding = '12px 8px';
    totalCell.style.borderTop = '2px solid #dee2e6';
    
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.width = '100%';
    container.style.maxWidth = '100%';
    container.style.overflow = 'hidden';
    
    const card = document.createElement('div');
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.padding = '10px 20px';
    card.style.backgroundColor = '#f8f9fa';
    card.style.border = '1px solid #dee2e6';
    card.style.borderRadius = '8px';
    card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    card.style.width = '100%';
    card.style.maxWidth = '600px';
    card.style.boxSizing = 'border-box';
    
    const header = document.createElement('div');
    header.style.fontSize = '14px';
    header.style.color = '#6c757d';
    header.style.marginBottom = '5px';
    header.textContent = 'Średnia ogólna ze wszystkich przedmiotów';
    
    const averageDisplay = document.createElement('div');
    averageDisplay.style.fontSize = '26px';
    averageDisplay.style.fontWeight = 'bold';
    averageDisplay.style.color = averageColor;
    averageDisplay.textContent = formattedTotalAverage;
    
    const subjectCount = document.createElement('div');
    subjectCount.style.fontSize = '13px';
    subjectCount.style.color = '#6c757d';
    subjectCount.style.marginTop = '5px';
    subjectCount.textContent = `Liczba przedmiotów: ${subjectAverages.length}`;
    
    card.appendChild(header);
    card.appendChild(averageDisplay);
    card.appendChild(subjectCount);
    
    container.appendChild(card);
    
    totalCell.appendChild(container);
    
    totalRow.appendChild(totalCell);
    
    const tbody = table.querySelector('tbody') || table;
    tbody.appendChild(totalRow);
}

function addGraphUI(row, subjectName, gradeEntries) {
    const existingGraph = row.querySelector('.average-graph-container');
    
    if (existingGraph) {
        return;
    }

    const sortedEntries = [...gradeEntries].sort((a, b) => a.date - b.date);
    
    if (sortedEntries.length < 2) {
        return;
    }
    
    const averageEvolution = [];
    let runningTotalWeightedValue = 0;
    let runningTotalWeight = 0;
    
    sortedEntries.forEach(entry => {
        runningTotalWeightedValue += entry.value * entry.weight;
        runningTotalWeight += entry.weight;
        
        const pointAverage = runningTotalWeightedValue / runningTotalWeight;
        
        averageEvolution.push({
            date: entry.date,
            average: pointAverage,
            value: entry.value,
            weight: entry.weight
        });
    });
    
    const subjectNameCell = row.querySelector('td:first-child');
    const buttonsContainer = getOrCreateButtonsContainer(subjectNameCell);
    
    const graphContainer = document.createElement('div');
    graphContainer.className = 'average-graph-container';
    graphContainer.style.display = 'none';
    graphContainer.style.padding = '15px';
    graphContainer.style.width = '100%';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.height = 'auto';
    chartContainer.style.position = 'relative';
    chartContainer.style.margin = '10px 0';
    chartContainer.style.border = '1px solid #ddd';
    chartContainer.style.borderRadius = '5px';
    chartContainer.style.padding = '10px';
    chartContainer.style.boxSizing = 'border-box';
    chartContainer.style.backgroundColor = '#fff';
    chartContainer.style.overflow = 'hidden';
    
    const title = document.createElement('div');
    title.style.textAlign = 'center';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '14px';
    title.style.marginBottom = '15px';
    title.textContent = `Zmiana średniej w czasie - ${subjectName}`;
    chartContainer.appendChild(title);
    
    const tooltipDiv = document.createElement('div');
    tooltipDiv.className = 'graph-tooltip';
    tooltipDiv.style.position = 'absolute';
    tooltipDiv.style.display = 'none';
    tooltipDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    tooltipDiv.style.color = 'white';
    tooltipDiv.style.padding = '8px';
    tooltipDiv.style.borderRadius = '4px';
    tooltipDiv.style.fontSize = '12px';
    tooltipDiv.style.pointerEvents = 'none';
    tooltipDiv.style.zIndex = '10';
    tooltipDiv.style.whiteSpace = 'nowrap';
    tooltipDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    chartContainer.appendChild(tooltipDiv);
    
    const svgContainer = document.createElement('div');
    svgContainer.style.width = '100%';
    svgContainer.style.position = 'relative';
    svgContainer.style.height = '220px';
    
    const graphSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    graphSvg.setAttribute('width', '100%');
    graphSvg.setAttribute('height', '220px');
    graphSvg.style.backgroundColor = '#f9f9f9';
    graphSvg.style.border = '1px solid #eee';
    graphSvg.style.borderRadius = '3px';
    
    graphSvg.setAttribute('data-min-average', Math.max(1, Math.min(...averageEvolution.map(p => p.average)) - 0.5));
    graphSvg.setAttribute('data-max-average', Math.min(6, Math.max(...averageEvolution.map(p => p.average)) + 0.5));
    
    svgContainer.appendChild(graphSvg);
    
    const minAverage = Math.max(1, Math.min(...averageEvolution.map(p => p.average)) - 0.5);
    const maxAverage = Math.min(6, Math.max(...averageEvolution.map(p => p.average)) + 0.5);
    const range = maxAverage - minAverage;
    
    for (let i = Math.ceil(minAverage); i <= Math.floor(maxAverage); i++) {
        const y = 180 - ((i - minAverage) / range) * 160;
        
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', '30');
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', '96%');
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', '#ddd');
        gridLine.setAttribute('stroke-width', '1');
        graphSvg.appendChild(gridLine);
        
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '10');
        label.setAttribute('y', y + 4);
        label.setAttribute('font-size', '10');
        label.setAttribute('text-anchor', 'start');
        label.textContent = i.toString();
        graphSvg.appendChild(label);
    }
    
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return `${day}.${month < 10 ? '0' + month : month}`;
    };
    
    averageEvolution.forEach((point, index) => {
        const maxWidth = averageEvolution.length < 3 ? 320 : 620;
        const x = 30 + (index / (averageEvolution.length - 1)) * maxWidth;
        const y = 180 - ((point.average - minAverage) / range) * 160;
        
        const dateLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dateLabel.setAttribute('x', x);
        dateLabel.setAttribute('y', '215');
        dateLabel.setAttribute('font-size', '10');
        dateLabel.setAttribute('text-anchor', 'middle');
        dateLabel.textContent = formatDate(point.date);
        graphSvg.appendChild(dateLabel);
        
        let pointColor = '#1783db';
        
        if (index > 0) {
            const prevAvg = averageEvolution[index-1].average;
            if (point.average > prevAvg) {
                pointColor = '#1b8e27';
            } else if (point.average < prevAvg) {
                pointColor = '#e63946';
            }
        }
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '5');
        circle.setAttribute('fill', pointColor);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '1');
        circle.setAttribute('data-index', index);
        
        circle.addEventListener('mouseover', (e) => {
            circle.setAttribute('r', '7');
            circle.setAttribute('stroke-width', '2');
            
            const pointData = averageEvolution[index];
            tooltipDiv.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 3px; text-align: center;">
                    ${formatDate(pointData.date)}
                </div>
                <div>Średnia: <strong>${pointData.average.toFixed(2)}</strong></div>
                <div>Ocena: <strong>${pointData.value}</strong> (Waga: ${pointData.weight})</div>
                ${index > 0 ? 
                    `<div style="margin-top: 3px; color: ${pointColor};">
                        ${pointData.average > averageEvolution[index-1].average ? '↑' : 
                          pointData.average < averageEvolution[index-1].average ? '↓' : '→'}
                        ${Math.abs(pointData.average - averageEvolution[index-1].average).toFixed(2)}
                    </div>` : 
                    ''
                }
            `;
            
            const svgRect = graphSvg.getBoundingClientRect();
            const circleX = parseFloat(circle.getAttribute('cx'));
            const circleY = parseFloat(circle.getAttribute('cy'));
            
            tooltipDiv.style.left = `${circleX + 5}px`;
            tooltipDiv.style.top = `${circleY - 60}px`;
            tooltipDiv.style.display = 'block';
        });
        
        circle.addEventListener('mouseout', () => {
            circle.setAttribute('r', '5');
            circle.setAttribute('stroke-width', '1');
            tooltipDiv.style.display = 'none';
        });
        
        graphSvg.appendChild(circle);
        
        if (index > 0) {
            const prevPoint = averageEvolution[index-1];
            const prevX = 30 + ((index-1) / (averageEvolution.length - 1)) * (averageEvolution.length < 3 ? 320 : 620);
            const prevY = 180 - ((prevPoint.average - minAverage) / range) * 160;
            
            let lineColor = '#1783db';
            if (point.average > prevPoint.average) {
                lineColor = '#1b8e27';
            } else if (point.average < prevPoint.average) {
                lineColor = '#e63946';
            }
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', prevX);
            line.setAttribute('y1', prevY);
            line.setAttribute('x2', x);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', lineColor);
            line.setAttribute('stroke-width', '2.5');
            line.setAttribute('data-start-index', index-1);
            line.setAttribute('data-end-index', index);
            
            const hoverArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const width = Math.abs(x - prevX);
            const height = 180;
            
            const rectX = Math.min(prevX, x);
            const rectY = 0;
            
            hoverArea.setAttribute('x', rectX);
            hoverArea.setAttribute('y', rectY);
            hoverArea.setAttribute('width', width);
            hoverArea.setAttribute('height', height);
            hoverArea.setAttribute('fill', 'transparent');
            hoverArea.setAttribute('data-start-index', index-1);
            hoverArea.setAttribute('data-end-index', index);
            hoverArea.style.cursor = 'pointer';
            
            const handleHover = () => {
                line.setAttribute('stroke-width', '4');
                
                const startPoint = averageEvolution[index-1];
                const endPoint = averageEvolution[index];
                const diff = endPoint.average - startPoint.average;
                const trend = diff > 0 ? 'Poprawa' : diff < 0 ? 'Spadek' : 'Bez zmian';
                const trendColor = diff > 0 ? '#1b8e27' : diff < 0 ? '#e63946' : '#1783db';
                
                tooltipDiv.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 3px; text-align: center;">
                        ${formatDate(startPoint.date)} → ${formatDate(endPoint.date)}
                    </div>
                    <div style="color: ${trendColor}; font-weight: bold;">
                        ${trend}: ${Math.abs(diff).toFixed(2)}
                    </div>
                    <div style="margin-top: 3px;">
                        Zmiana: ${startPoint.average.toFixed(2)} → ${endPoint.average.toFixed(2)}
                    </div>
                `;
                
                const midX = (parseFloat(line.getAttribute('x1')) + parseFloat(line.getAttribute('x2'))) / 2;
                const midY = (parseFloat(line.getAttribute('y1')) + parseFloat(line.getAttribute('y2'))) / 2;
                
                tooltipDiv.style.left = `${midX + 10}px`;
                tooltipDiv.style.top = `${midY - 40}px`;
                tooltipDiv.style.display = 'block';
            };
            
            const handleMouseout = () => {
                line.setAttribute('stroke-width', '2.5');
                tooltipDiv.style.display = 'none';
            };
            
            line.addEventListener('mouseover', handleHover);
            line.addEventListener('mouseout', handleMouseout);
            hoverArea.addEventListener('mouseover', handleHover);
            hoverArea.addEventListener('mouseout', handleMouseout);
            
            graphSvg.appendChild(hoverArea);
            graphSvg.appendChild(line);
        }
    });
    
    chartContainer.appendChild(svgContainer);
    
    const legend = document.createElement('div');
    legend.style.marginTop = '5px';
    legend.style.padding = '5px 10px';
    legend.style.backgroundColor = '#f0f0f0';
    legend.style.borderRadius = '3px';
    legend.style.fontSize = '12px';
    legend.style.width = '100%';
    legend.style.boxSizing = 'border-box';
    
    const initialAverage = averageEvolution[0].average;
    const currentAverage = averageEvolution[averageEvolution.length-1].average;
    const averageDiff = currentAverage - initialAverage;
    
    let trendIcon = '';
    let trendColor = '#666';
    
    if (averageDiff > 0) {
        trendIcon = '↑ ';
        trendColor = '#1b8e27';
    } else if (averageDiff < 0) {
        trendIcon = '↓ ';
        trendColor = '#e63946';
    }
    
    legend.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; width: 100%;">
            <div style="margin-bottom: 5px; margin-right: 10px;">
                <div style="display: inline-block; width: 12px; height: 3px; background-color: #1b8e27; margin-right: 5px;"></div> Poprawa
                <div style="display: inline-block; width: 12px; height: 3px; background-color: #e63946; margin: 0 5px 0 10px;"></div> Spadek
                <div style="display: inline-block; width: 12px; height: 3px; background-color: #1783db; margin: 0 5px 0 10px;"></div> Bez zmian
            </div>
            <div style="white-space: nowrap; margin-bottom: 5px;">
                Średnia początkowa: <strong>${initialAverage.toFixed(2)}</strong>
                <span style="margin: 0 5px;">→</span>
                <span style="color: ${trendColor};">Obecna średnia: ${trendIcon}${currentAverage.toFixed(2)}</span>
            </div>
        </div>
    `;
    
    chartContainer.appendChild(legend);
    graphContainer.appendChild(chartContainer);
    
    const gradesCell = row.querySelector('td:nth-child(2)');
    gradesCell.appendChild(graphContainer);
    
    const showGraphButton = document.createElement('button');
    showGraphButton.textContent = 'Wykres';
    showGraphButton.title = 'Pokaż/ukryj wykres średniej';
    showGraphButton.style.marginRight = '5px';
    showGraphButton.style.padding = '3px 8px';
    showGraphButton.style.backgroundColor = '#1783db';
    showGraphButton.style.color = 'white';
    showGraphButton.style.border = 'none';
    showGraphButton.style.borderRadius = '3px';
    showGraphButton.style.cursor = 'pointer';
    
    showGraphButton.addEventListener('click', () => {
        const isVisible = graphContainer.style.display !== 'none';
        graphContainer.style.display = isVisible ? 'none' : 'block';
    });
    
    buttonsContainer.appendChild(showGraphButton);
}

function addSimulationUI(subjectNameCell, currentTotalWeightedValue, currentTotalWeight, currentAverage) {
    if (subjectNameCell.querySelector('.grade-simulator')) {
        return;
    }

    const buttonsContainer = getOrCreateButtonsContainer(subjectNameCell);

    try {
        const simButton = document.createElement('button');
        simButton.textContent = '+';
        simButton.title = 'Symuluj ocenę';
        simButton.style.marginRight = '5px';
        simButton.style.padding = '3px 8px';
        simButton.style.backgroundColor = '#1783db';
        simButton.style.color = 'white';
        simButton.style.border = 'none';
        simButton.style.borderRadius = '3px';
        simButton.style.cursor = 'pointer';
        simButton.style.minWidth = '28px';
        
        const simContainer = document.createElement('div');
        simContainer.className = 'grade-simulator';
        simContainer.style.maxWidth = '100%';
        simContainer.style.display = 'none';
        simContainer.style.marginTop = '5px';
        simContainer.style.padding = '12px';
        simContainer.style.backgroundColor = '#f0f0f0';
        simContainer.style.border = '1px solid #ccc';
        simContainer.style.borderRadius = '3px';
        simContainer.style.boxSizing = 'border-box';
        simContainer.style.overflow = 'visible';
        
        simButton.addEventListener('click', () => {
            const isVisible = simContainer.style.display === 'none';
            simContainer.style.display = isVisible ? 'block' : 'none';
            simButton.textContent = isVisible ? '-' : '+';
        });
        
        const simulatedGrades = [];
        
        const gradeRow = document.createElement('div');
        gradeRow.style.marginBottom = '10px';
        gradeRow.style.display = 'flex';
        gradeRow.style.alignItems = 'center';
        
        const gradeLabel = document.createElement('div');
        gradeLabel.textContent = 'Symuluj ocenę: ';
        gradeLabel.style.marginRight = '8px';
        gradeLabel.style.minWidth = '100px';
        gradeLabel.style.flexShrink = '0';
        
        const gradeSelect = document.createElement('select');
        gradeSelect.style.width = '65px';
        gradeSelect.style.minWidth = 'min-content';
        gradeSelect.style.flexGrow = '1';

        const gradeOptions = [
            {value: '1', text: '1'},
            {value: '1.5', text: '1+'},
            {value: '1.75', text: '2-'},
            {value: '2', text: '2'},
            {value: '2.5', text: '2+'},
            {value: '2.75', text: '3-'},
            {value: '3', text: '3'},
            {value: '3.5', text: '3+'},
            {value: '3.75', text: '4-'},
            {value: '4', text: '4'},
            {value: '4.5', text: '4+'},
            {value: '4.75', text: '5-'},
            {value: '5', text: '5'},
            {value: '5.5', text: '5+'},
            {value: '5.75', text: '6-'},
            {value: '6', text: '6'}
        ];

        gradeOptions.forEach(option => {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.text;
            gradeSelect.appendChild(optionEl);
        });

        const weightRow = document.createElement('div');
        weightRow.style.marginBottom = '10px';
        weightRow.style.display = 'flex';
        weightRow.style.alignItems = 'center';
        
        const weightLabel = document.createElement('div');
        weightLabel.textContent = 'Waga: ';
        weightLabel.style.marginRight = '8px';
        weightLabel.style.minWidth = '100px';
        weightLabel.style.flexShrink = '0';
        
        const weightSelect = document.createElement('select');
        weightSelect.style.width = '80px';
        weightSelect.style.minWidth = 'min-content';
        weightSelect.style.flexGrow = '1';

        [1, 2, 3].forEach(weight => {
            const option = document.createElement('option');
            option.value = weight;
            option.textContent = `Waga ${weight}`;
            weightSelect.appendChild(option);
        });

        const buttonRow = document.createElement('div');
        buttonRow.style.marginTop = '10px';
        buttonRow.style.width = '100%';
        buttonRow.style.display = 'flex';
        buttonRow.style.justifyContent = 'space-between';
        
        const resultSpan = document.createElement('span');
        resultSpan.style.display = 'block';
        resultSpan.style.marginTop = '12px';
        resultSpan.style.fontWeight = 'bold';
        resultSpan.style.textAlign = 'center';

        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'Oblicz';
        calculateButton.style.padding = '5px 10px';
        calculateButton.style.backgroundColor = '#1783db';
        calculateButton.style.color = 'white';
        calculateButton.style.border = 'none';
        calculateButton.style.borderRadius = '3px';
        calculateButton.style.cursor = 'pointer';
        calculateButton.style.width = '40%';
        calculateButton.style.display = 'block';
        
        const addToSimButton = document.createElement('button');
        addToSimButton.textContent = 'Dodaj do wykresu';
        addToSimButton.style.padding = '5px 5px';
        addToSimButton.style.backgroundColor = '#28a745';
        addToSimButton.style.color = 'white';
        addToSimButton.style.border = 'none';
        addToSimButton.style.borderRadius = '3px';
        addToSimButton.style.cursor = 'pointer';
        addToSimButton.style.width = '55%';
        addToSimButton.style.display = 'block';

        const clearSimButton = document.createElement('button');
        clearSimButton.textContent = 'Wyczyść';
        clearSimButton.style.padding = '5px 5px';
        clearSimButton.style.backgroundColor = '#e63946';
        clearSimButton.style.color = 'white';
        clearSimButton.style.border = 'none';
        clearSimButton.style.borderRadius = '3px';
        clearSimButton.style.cursor = 'pointer';
        clearSimButton.style.width = '30%';
        clearSimButton.style.display = 'block';
        clearSimButton.style.display = 'none';
        
        const simListContainer = document.createElement('div');
        simListContainer.className = 'simulated-grades-list';
        simListContainer.style.marginTop = '15px';
        simListContainer.style.display = 'none';
        simListContainer.style.maxHeight = '150px';
        simListContainer.style.overflowY = 'auto';
        simListContainer.style.border = '1px solid #ddd';
        simListContainer.style.borderRadius = '3px';
        simListContainer.style.padding = '8px';
        simListContainer.style.backgroundColor = '#fafafa';
        
        const simListHeading = document.createElement('div');
        simListHeading.textContent = 'Lista symulowanych ocen:';
        simListHeading.style.fontWeight = 'bold';
        simListHeading.style.marginBottom = '5px';
        simListHeading.style.fontSize = '12px';
        simListContainer.appendChild(simListHeading);
        
        const simList = document.createElement('div');
        simList.className = 'sim-grades-items';
        simListContainer.appendChild(simList);
        
        function updateSimulatedGrades() {
            simList.innerHTML = '';
            
            if (simulatedGrades.length === 0) {
                simListContainer.style.display = 'none';
                clearSimButton.style.display = 'none';
                resultSpan.textContent = '';
                
                const subjectRow = subjectNameCell.closest('tr');
                if (subjectRow) {
                    const graphContainer = subjectRow.querySelector('.average-graph-container');
                    if (graphContainer) {
                        const simulationElements = graphContainer.querySelectorAll('[data-simulation="true"]');
                        simulationElements.forEach(element => element.remove());
                    }
                }
                return;
            }
            
            simListContainer.style.display = 'block';
            clearSimButton.style.display = 'block';
            
            let newTotalWeightedValue = currentTotalWeightedValue;
            let newTotalWeight = currentTotalWeight;
            
            simulatedGrades.forEach(grade => {
                newTotalWeightedValue += grade.value * grade.weight;
                newTotalWeight += grade.weight;
            });
            
            const newAverage = newTotalWeight > 0 ? newTotalWeightedValue / newTotalWeight : 0;
            
            resultSpan.textContent = `Nowa średnia: ${newAverage.toFixed(2)} (${currentAverage.toFixed(2)}\u00A0→\u00A0${newAverage.toFixed(2)})`;
            
            if (newAverage > currentAverage) {
                resultSpan.style.color = 'green';
            } else if (newAverage < currentAverage) {
                resultSpan.style.color = 'red';
            } else {
                resultSpan.style.color = 'black';
            }
            
            simulatedGrades.forEach((grade) => {
                const gradeItem = document.createElement('div');
                gradeItem.style.display = 'flex';
                gradeItem.style.justifyContent = 'space-between';
                gradeItem.style.alignItems = 'center';
                gradeItem.style.padding = '5px';
                gradeItem.style.marginBottom = '3px';
                gradeItem.style.backgroundColor = '#f0f0f0';
                gradeItem.style.borderRadius = '3px';
                gradeItem.style.fontSize = '12px';
                
                const gradeText = document.createElement('div');
                gradeText.innerHTML = `<strong>${grade.value}</strong> (waga: ${grade.weight})`;
                gradeItem.appendChild(gradeText);
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'X';
                deleteButton.style.backgroundColor = '#ff6b6b';
                deleteButton.style.color = 'white';
                deleteButton.style.border = 'none';
                deleteButton.style.borderRadius = '2px';
                deleteButton.style.cursor = 'pointer';
                deleteButton.style.padding = '0 5px';
                deleteButton.style.fontSize = '10px';
                deleteButton.style.marginLeft = '5px';
                
                deleteButton.addEventListener('click', () => {
                    simulatedGrades.splice(simulatedGrades.indexOf(grade), 1);
                    updateSimulatedGrades();
                });
                
                gradeItem.appendChild(deleteButton);
                simList.appendChild(gradeItem);
            });
            
            const subjectRow = subjectNameCell.closest('tr');
            if (subjectRow) {
                const graphContainer = subjectRow.querySelector('.average-graph-container');
                if (graphContainer && graphContainer.style.display !== 'none') {
                    showMultipleSimulatedGradesOnGraph(graphContainer, currentAverage, newAverage, simulatedGrades, currentTotalWeightedValue, currentTotalWeight);
                }
            }
        }
        
        calculateButton.addEventListener('click', () => {
            const selectedGrade = parseFloat(gradeSelect.value);
            const selectedWeight = parseInt(weightSelect.value, 10);

            const newTotalWeightedValue = currentTotalWeightedValue + (selectedGrade * selectedWeight);
            const newTotalWeight = currentTotalWeight + selectedWeight;
            const newAverage = newTotalWeight > 0 ? newTotalWeightedValue / newTotalWeight : 0;

            resultSpan.textContent = `Nowa średnia: ${newAverage.toFixed(2)} (${currentAverage.toFixed(2)}\u00A0→\u00A0${newAverage.toFixed(2)})`;

            if (newAverage > currentAverage) {
                resultSpan.style.color = 'green';
            } else if (newAverage < currentAverage) {
                resultSpan.style.color = 'red';
            } else {
                resultSpan.style.color = 'black';
            }
        });
        
        addToSimButton.addEventListener('click', () => {
            const selectedGrade = parseFloat(gradeSelect.value);
            const selectedWeight = parseInt(weightSelect.value, 10);
            
            simulatedGrades.push({
                value: selectedGrade,
                weight: selectedWeight
            });
            
            updateSimulatedGrades();
        });

        clearSimButton.addEventListener('click', () => {
            simulatedGrades.length = 0;
            updateSimulatedGrades();
            
            const subjectRow = subjectNameCell.closest('tr');
            if (subjectRow) {
                const graphContainer = subjectRow.querySelector('.average-graph-container');
                if (graphContainer && graphContainer.style.display !== 'none') {
                    resetGraphToOriginalState(graphContainer);
                }
            }
        });

        gradeRow.appendChild(gradeLabel);
        gradeRow.appendChild(gradeSelect);
        
        weightRow.appendChild(weightLabel);
        weightRow.appendChild(weightSelect);
        
        buttonRow.appendChild(calculateButton);
        buttonRow.appendChild(addToSimButton);
        buttonRow.appendChild(clearSimButton);
        
        simContainer.appendChild(gradeRow);
        simContainer.appendChild(weightRow);
        simContainer.appendChild(buttonRow);
        simContainer.appendChild(resultSpan);
        simContainer.appendChild(simListContainer);

        buttonsContainer.appendChild(simButton);
        
        subjectNameCell.appendChild(simContainer);
    } catch (error) {
        console.error('Error creating simulation UI:', error);
    }
}

function resetGraphToOriginalState(graphContainer) {
    const svg = graphContainer.querySelector('svg');
    if (!svg) return;
    
    const circles = svg.querySelectorAll('circle:not([data-simulation="true"])');
    const realPointsCount = circles.length;
    
    if (realPointsCount < 2) return;
    
    const maxWidth = realPointsCount < 3 ? 320 : 620;
    
    circles.forEach((circle, index) => {
        const x = 30 + (index / (realPointsCount - 1)) * maxWidth;
        circle.setAttribute('cx', x);
    });
    
    const realLines = svg.querySelectorAll('line:not([data-simulation="true"])');
    realLines.forEach((line) => {
        const startIndex = parseInt(line.getAttribute('data-start-index') || '0');
        const endIndex = parseInt(line.getAttribute('data-end-index') || '0');
        
        if (startIndex >= 0 && endIndex >= 0 && startIndex < realPointsCount && endIndex < realPointsCount) {
            const startX = 30 + (startIndex / (realPointsCount - 1)) * maxWidth;
            const endX = 30 + (endIndex / (realPointsCount - 1)) * maxWidth;
            
            line.setAttribute('x1', startX);
            line.setAttribute('x2', endX);
        }
    });
    
    const dateLabels = svg.querySelectorAll('text[y="215"]:not([data-simulation="true"])');
    dateLabels.forEach((label, index) => {
        const x = 30 + (index / (realPointsCount - 1)) * maxWidth;
        label.setAttribute('x', x);
    });
    
    const hoverAreas = svg.querySelectorAll('rect[data-start-index]:not([data-simulation="true"])');
    hoverAreas.forEach((area) => {
        const startIndex = parseInt(area.getAttribute('data-start-index') || '0');
        const endIndex = parseInt(area.getAttribute('data-end-index') || '0');
        
        if (startIndex >= 0 && endIndex >= 0 && startIndex < realPointsCount && endIndex < realPointsCount) {
            const x1 = 30 + (startIndex / (realPointsCount - 1)) * maxWidth;
            const x2 = 30 + (endIndex / (realPointsCount - 1)) * maxWidth;
            
            const rectX = Math.min(x1, x2);
            const rectWidth = Math.abs(x2 - x1);
            
            area.setAttribute('x', rectX);
            area.setAttribute('width', rectWidth);
        }
    });
}

function showMultipleSimulatedGradesOnGraph(graphContainer, currentAverage, newAverage, simulatedGrades, initialWeightedValue, initialWeight) {
    const existingSimulation = graphContainer.querySelectorAll('[data-simulation="true"]');
    existingSimulation.forEach(element => element.remove());
    
    resetGraphToOriginalState(graphContainer);
    
    const svg = graphContainer.querySelector('svg');
    if (!svg) return;
    
    const circles = svg.querySelectorAll('circle:not([data-simulation="true"])');
    const realAverages = Array.from(circles).map(circle => parseFloat(circle.getAttribute('cy')) || currentAverage);
    
    let runningWeightedValue = initialWeightedValue;
    let runningWeight = initialWeight;
    const simulatedAverages = [];
    
    simulatedGrades.forEach(grade => {
        runningWeightedValue += grade.value * grade.weight;
        runningWeight += grade.weight;
        simulatedAverages.push(runningWeightedValue / runningWeight);
    });
    
    const allAverages = [...realAverages, ...simulatedAverages, currentAverage];
    const lowestAverage = Math.min(...allAverages);
    const highestAverage = Math.max(...allAverages);
    
    const newMinAverage = Math.max(1, Math.floor(lowestAverage * 2) / 2 - 0.5);
    const newMaxAverage = Math.min(6, Math.ceil(highestAverage * 2) / 2 + 0.5);
    
    svg.setAttribute('data-min-average', newMinAverage);
    svg.setAttribute('data-max-average', newMaxAverage);
    
    const range = newMaxAverage - newMinAverage;
    
    svg.querySelectorAll('line[stroke="#ddd"]').forEach(line => line.remove());
    svg.querySelectorAll('text[x="10"]').forEach(text => text.remove());
    
    for (let i = Math.ceil(newMinAverage); i <= Math.floor(newMaxAverage); i++) {
        const y = 180 - ((i - newMinAverage) / range) * 160;
        
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', '30');
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', '96%');
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', '#ddd');
        gridLine.setAttribute('stroke-width', '1');
        svg.appendChild(gridLine);
        
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '10');
        label.setAttribute('y', y + 4);
        label.setAttribute('font-size', '10');
        label.setAttribute('text-anchor', 'start');
        label.textContent = i.toString();
        svg.appendChild(label);
    }
    
    const realPointsCount = circles.length;
    const totalPointsCount = realPointsCount + simulatedGrades.length;
    const maxWidth = Math.min(620, svg.getBoundingClientRect().width * 0.85);
    const pointSpacing = maxWidth / (totalPointsCount - 1);
    
    const averageEvolution = [];
    circles.forEach((circle, index) => {
        const pointIndex = parseInt(circle.getAttribute('data-index') || '0');
        const pointAverage = parseFloat(circle.getAttribute('data-original-average') || currentAverage);
        averageEvolution[pointIndex] = pointAverage;
        
        const x = 30 + (index * pointSpacing);
        const y = 180 - ((pointAverage - newMinAverage) / range) * 160;
        
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('data-original-average', pointAverage);
    });
    
    const realLines = svg.querySelectorAll('line:not([data-simulation="true"])');
    realLines.forEach((line) => {
        const startIndex = parseInt(line.getAttribute('data-start-index') || '0');
        const endIndex = parseInt(line.getAttribute('data-end-index') || '0');
        
        if (startIndex >= 0 && endIndex >= 0 && startIndex < realPointsCount && endIndex < realPointsCount) {
            const startX = 30 + (startIndex * pointSpacing);
            const startY = 180 - ((averageEvolution[startIndex] - newMinAverage) / range) * 160;
            const endX = 30 + (endIndex * pointSpacing);
            const endY = 180 - ((averageEvolution[endIndex] - newMinAverage) / range) * 160;
            
            line.setAttribute('x1', startX);
            line.setAttribute('y1', startY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
        }
    });
    
    const dateLabels = svg.querySelectorAll('text[y="215"]:not([data-simulation="true"])');
    dateLabels.forEach((label, index) => {
        const x = 30 + (index * pointSpacing);
        label.setAttribute('x', x);
    });
    
    const hoverAreas = svg.querySelectorAll('rect[data-start-index]:not([data-simulation="true"])');
    hoverAreas.forEach((area) => {
        const startIndex = parseInt(area.getAttribute('data-start-index') || '0');
        const endIndex = parseInt(area.getAttribute('data-end-index') || '0');
        
        if (startIndex >= 0 && endIndex >= 0 && startIndex < realPointsCount && endIndex < realPointsCount) {
            const x1 = 30 + (startIndex * pointSpacing);
            const x2 = 30 + (endIndex * pointSpacing);
            
            const rectX = Math.min(x1, x2);
            const rectWidth = Math.abs(x2 - x1);
            
            area.setAttribute('x', rectX);
            area.setAttribute('width', rectWidth);
        }
    });
    
    let lastPointX = 30 + ((realPointsCount - 1) * pointSpacing);
    let lastPointY = 180 - ((currentAverage - newMinAverage) / range) * 160;
    let lastAverage = currentAverage;
    
    runningWeightedValue = initialWeightedValue;
    runningWeight = initialWeight;
    
    simulatedGrades.forEach((grade, index) => {
        runningWeightedValue += grade.value * grade.weight;
        runningWeight += grade.weight;
        const pointAverage = runningWeight > 0 ? runningWeightedValue / runningWeight : 0;
        
        const pointX = 30 + ((realPointsCount + index) * pointSpacing);
        const pointY = 180 - ((pointAverage - newMinAverage) / range) * 160;
        
        let stepColor = '#1783db';
        if (pointAverage > lastAverage) {
            stepColor = '#1b8e27';
        } else if (pointAverage < lastAverage) {
            stepColor = '#e63946';
        }
        
        const dashedLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        dashedLine.setAttribute('x1', lastPointX);
        dashedLine.setAttribute('y1', lastPointY);
        dashedLine.setAttribute('x2', pointX);
        dashedLine.setAttribute('y2', pointY);
        dashedLine.setAttribute('stroke', stepColor);
        dashedLine.setAttribute('stroke-width', '2');
        dashedLine.setAttribute('stroke-dasharray', '4');
        dashedLine.setAttribute('data-simulation', 'true');
        svg.appendChild(dashedLine);
        
        const simCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        simCircle.setAttribute('cx', pointX);
        simCircle.setAttribute('cy', pointY);
        simCircle.setAttribute('r', '5');
        simCircle.setAttribute('fill', '#ff6b6b');
        simCircle.setAttribute('stroke', '#fff');
        simCircle.setAttribute('stroke-width', '1');
        simCircle.setAttribute('data-simulation', 'true');
        svg.appendChild(simCircle);
        
        const fontSize = totalPointsCount > 10 ? '7' : totalPointsCount > 7 ? '8' : '9';
        const labelOffset = totalPointsCount > 10 ? 7 : totalPointsCount > 7 ? 8 : 12;
        
        const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        valueLabel.setAttribute('x', pointX);
        valueLabel.setAttribute('y', Math.max(pointY - labelOffset, 10));
        valueLabel.setAttribute('font-size', fontSize);
        valueLabel.setAttribute('fill', '#ff6b6b');
        valueLabel.setAttribute('text-anchor', 'middle');
        valueLabel.setAttribute('data-simulation', 'true');
        valueLabel.textContent = `${grade.value} (${grade.weight})`;
        svg.appendChild(valueLabel);
        
        if (simulatedGrades.length <= 8) {
            const indexLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            indexLabel.setAttribute('x', pointX);
            indexLabel.setAttribute('y', Math.min(pointY + 15, 170));
            indexLabel.setAttribute('font-size', fontSize);
            indexLabel.setAttribute('fill', '#666');
            indexLabel.setAttribute('text-anchor', 'middle');
            indexLabel.setAttribute('data-simulation', 'true');
            indexLabel.textContent = `#${index + 1}`;
            svg.appendChild(indexLabel);
        }
        
        lastPointX = pointX;
        lastPointY = pointY;
        lastAverage = pointAverage;
    });
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function isPageReady() {
    const rows = document.querySelectorAll('tr.naglowek3');
    return rows.length > 0;
}

const debouncedCalculateAverages = debounce(calculateAverages, 300);

function initializeExtension() {
    if (isPageReady()) {
        if (window.requestIdleCallback) {
            requestIdleCallback(() => debouncedCalculateAverages());
        } else {
            setTimeout(debouncedCalculateAverages, 100);
        }
    } else {
        setTimeout(initializeExtension, 800);
    }
}

function setupMutationObserver() {
    const targetNode = document.querySelector('table') || document.body;
    
    let observerThrottle = false;
    const throttleTime = 1000;
    
    const observer = new MutationObserver((mutations) => {
        if (observerThrottle) return;
        
        const hasRelevantChanges = mutations.some(mutation => 
            mutation.type === 'childList' && 
            (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
        );
        
        if (hasRelevantChanges && isPageReady()) {
            observerThrottle = true;
            
            setTimeout(() => {
                debouncedCalculateAverages();
                observerThrottle = false;
            }, 100);
            
            setTimeout(() => {
                observerThrottle = false;
            }, throttleTime);
        }
    });
    
    observer.observe(targetNode, { 
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeExtension, 200);
    setupMutationObserver();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeExtension, 200);
    setupMutationObserver();
}

const runtime = typeof browser !== 'undefined' ? browser.runtime : chrome.runtime;

runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'calculateAverages') {
        try {
            calculateAverages();
            sendResponse({ success: true });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
    return true;
});