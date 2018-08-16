/**
 * Created by venkatsrinag on 12/4/17.
 */
import '../../lib/annotator.min'


export function initializeMlAnnotator(eventsCallback){

    let callback = eventsCallback;
    Annotator.Plugin.MyPlugin = function (element, options) {
    };

    jQuery.extend(Annotator.Plugin.MyPlugin.prototype, new Annotator.Plugin(), {
        events: {},
        options: {
        },
        pluginInit: function () {
            this.annotator.subscribe("annotationCreated", function(annotation){
                delete annotation.highlights
                callback && callback('create', annotation)
            })
            .subscribe("annotationViewerShown", function (editor, annotation) {
                callback('annotationViewer', annotation)
            })
            .subscribe("annotationUpdated", function (annotation) {
                console.info("The annotation: %o has just been updated!", annotation)
                callback && callback('update', annotation)
            })
            .subscribe("beforeAnnotationCreated", function(annotation){
                console.info("The annotation: %o has just been deleted!", annotation)
                callback && callback('before', annotation)
            })
            .subscribe('annotationEditorSubmit', function(editor, annotation){
                console.info("The annotation: %o has just been submitted!", annotation)
                // callback && callback('submit', annotation, editor)
            })
            .subscribe('annotationEditorCancle', function(editor, annotation){
                console.info("The annotation: %o has just been submitted!", annotation)
                callback && callback('cancel', annotation, editor)
            })
            .subscribe("annotationDeleted", function (annotation) {
                console.info("The annotation: %o has just been deleted!", annotation)
                callback && callback('delete', annotation)
            });
        }
    });
}
